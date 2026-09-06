import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';

export interface Lead {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  companySize?: string;
  role?: string;
  phone?: string;
  message?: string;
  source: 'website' | 'trial' | 'webinar' | 'content' | 'partnership' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'trial' | 'proposal' | 'closed-won' | 'closed-lost';
  leadScore?: number;
  tags?: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  notes?: string;
}

/**
 * Capture lead from marketing website or trial signup
 */
export async function captureLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const leadsRef = collection(db, 'leads');
    
    // Check if lead already exists
    const existingQuery = query(leadsRef, where('email', '==', leadData.email));
    const existing = await getDocs(existingQuery);
    
    if (!existing.empty) {
      // Update existing lead
      const existingDoc = existing.docs[0];
      await updateDoc(doc(db, 'leads', existingDoc.id), {
        ...leadData,
        updatedAt: Timestamp.now(),
        leadScore: calculateLeadScore(leadData)
      });
      return existingDoc.id;
    }
    
    // Create new lead
    const docRef = await addDoc(leadsRef, {
      ...leadData,
      status: 'new',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      leadScore: calculateLeadScore(leadData)
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error capturing lead:', error);
    throw error;
  }
}

/**
 * Calculate lead score based on profile and engagement
 */
function calculateLeadScore(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): number {
  let score = 0;
  
  // Email domain score
  if (lead.email) {
    const domain = lead.email.split('@')[1];
    const freeEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    if (!freeEmailDomains.includes(domain)) {
      score += 30; // Business email = higher score
    }
  }
  
  // Company size score (bigger is better for B2B)
  if (lead.companySize) {
    const sizes: { [key: string]: number } = {
      'small': 10,
      'medium': 30,
      'large': 50,
      '50-250': 25,
      '250-1000': 40,
      '1000+': 50
    };
    score += sizes[lead.companySize] || 0;
  }
  
  // Role score (HR roles are higher priority)
  if (lead.role) {
    const roleScore: { [key: string]: number } = {
      'chro': 50,
      'cpo': 50,
      'head of people': 45,
      'vp hr': 45,
      'director': 40,
      'manager': 20,
      'individual contributor': 10
    };
    const roleLower = lead.role.toLowerCase();
    for (const [key, value] of Object.entries(roleScore)) {
      if (roleLower.includes(key)) {
        score += value;
        break;
      }
    }
  }
  
  // Source score
  if (lead.source) {
    const sourceScore: { [key in Lead['source']]: number } = {
      'partnership': 40,
      'content': 30,
      'webinar': 35,
      'trial': 50,
      'website': 20,
      'other': 10
    };
    score += sourceScore[lead.source] || 0;
  }
  
  // Message indicates interest
  if (lead.message && lead.message.length > 50) {
    score += 20;
  }
  
  return Math.min(score, 100); // Cap at 100
}

/**
 * Get all leads for sales team
 */
export async function getLeads(filters?: {
  status?: Lead['status'];
  source?: Lead['source'];
  minScore?: number;
  days?: number;
}): Promise<Lead[]> {
  try {
    let q = query(collection(db, 'leads'));
    
    if (filters?.status) {
      q = query(collection(db, 'leads'), where('status', '==', filters.status));
    }
    
    const querySnapshot = await getDocs(q);
    const leads: Lead[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      leads.push({
        ...data,
        id: doc.id
      } as Lead);
    });
    
    // Apply additional filters in memory
    return leads.filter(lead => {
      if (filters?.source && lead.source !== filters.source) return false;
      if (filters?.minScore && (lead.leadScore || 0) < filters.minScore) return false;
      return true;
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
}

/**
 * Update lead status
 */
export async function updateLeadStatus(
  leadId: string,
  status: Lead['status'],
  notes?: string
): Promise<void> {
  try {
    await updateDoc(doc(db, 'leads', leadId), {
      status,
      updatedAt: Timestamp.now(),
      ...(notes && { notes })
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
}

/**
 * Send lead to email marketing (integration point)
 */
export async function sendLeadToMarketing(lead: Lead): Promise<void> {
  try {
    // In production, this would integrate with:
    // - Mailchimp, HubSpot, or other email marketing platform
    // - CRM system for sales team
    // - Slack notification for sales team
    
    console.log('Sending lead to marketing system:', lead);
    
    // Example: Send to HubSpot
    // await fetch('/.netlify/functions/add-to-hubspot', {
    //   method: 'POST',
    //   body: JSON.stringify(lead)
    // });
    
    // Example: Notify sales team via Slack
    // await fetch('/.netlify/functions/slack-notification', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     lead,
    //     message: `New qualified lead: ${lead.firstName} ${lead.lastName} from ${lead.company}`
    //   })
    // });
  } catch (error) {
    console.error('Error sending lead to marketing:', error);
    throw error;
  }
}

/**
 * Get lead analytics
 */
export async function getLeadAnalytics(): Promise<{
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  conversions: number;
  avgLeadScore: number;
  sourceBreakdown: { [key: string]: number };
  statusBreakdown: { [key: string]: number };
}> {
  try {
    const leads = await getLeads();
    
    const sourceBreakdown: { [key: string]: number } = {};
    const statusBreakdown: { [key: string]: number } = {};
    let totalScore = 0;
    
    leads.forEach(lead => {
      sourceBreakdown[lead.source] = (sourceBreakdown[lead.source] || 0) + 1;
      statusBreakdown[lead.status] = (statusBreakdown[lead.status] || 0) + 1;
      totalScore += lead.leadScore || 0;
    });
    
    return {
      totalLeads: leads.length,
      newLeads: statusBreakdown['new'] || 0,
      qualifiedLeads: (statusBreakdown['qualified'] || 0) + (statusBreakdown['trial'] || 0),
      conversions: (statusBreakdown['closed-won'] || 0),
      avgLeadScore: leads.length > 0 ? totalScore / leads.length : 0,
      sourceBreakdown,
      statusBreakdown
    };
  } catch (error) {
    console.error('Error getting lead analytics:', error);
    throw error;
  }
}

/**
 * Export leads for sales team (CSV)
 */
export async function exportLeadsCSV(filters?: {
  status?: Lead['status'];
  minScore?: number;
}): Promise<string> {
  try {
    const leads = await getLeads(filters);
    
    // CSV header
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Company',
      'Company Size',
      'Role',
      'Phone',
      'Lead Score',
      'Status',
      'Source',
      'Message',
      'Created At'
    ];
    
    // CSV rows
    const rows = leads.map(lead => [
      lead.firstName || '',
      lead.lastName || '',
      lead.email,
      lead.company || '',
      lead.companySize || '',
      lead.role || '',
      lead.phone || '',
      lead.leadScore || '',
      lead.status,
      lead.source,
      (lead.message || '').replace(/"/g, '""'),
      lead.createdAt ? lead.createdAt.toDate().toLocaleDateString() : ''
    ]);
    
    // Combine
    const csv = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    return csv;
  } catch (error) {
    console.error('Error exporting leads:', error);
    throw error;
  }
}

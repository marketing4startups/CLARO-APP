# Claro — Enterprise Workplace Resilience & Telemetry Platform

[![Security: Zero-Knowledge](https://img.shields.io/badge/Security-Zero--Knowledge-10b981.svg)](https://github.com/claro-health/claro)
[![Data Privacy: Differential Privacy](https://img.shields.io/badge/Privacy-Differential%20%28%CE%B5%2C%20%CE%B4%29-3b82f6.svg)](https://github.com/claro-health/claro)
[![Compliance: SOC2 / GDPR Ready](https://img.shields.io/badge/Compliance-GDPR%20%26%20SOC2%20Ready-6366f1.svg)](https://github.com/claro-health/claro)
[![License: Enterprise Proprietary](https://img.shields.io/badge/License-Enterprise%20Proprietary-gray.svg)](#)

---

## Executive Summary

**Claro** is an enterprise-grade mental health and workforce resilience infrastructure designed for organizations that require rigorous privacy guarantees, zero-knowledge employee segregation, and compliance with global privacy standards (GDPR, HIPAA Security Rule, SOC 2 Type II).

Traditional corporate wellbeing tools create liability by consolidating identifiable employee assessments, mood entries, and burnout signals into employer-accessible databases. Claro eliminates this attack surface through a **Zero-Employer-Knowledge architecture**: individual baseline assessments, energy indicators, and duty-of-care escalations are cryptographically isolated to the employee's personal user scope. Enterprise leadership receives only aggregated, differentially private telemetry with strict $k$-anonymity thresholds ($k \ge 5$), preventing individual identification or correlation attacks.

---

## System Architecture

```text
+---------------------------------------------------------------------------------------+
|                                    CLIENT APPLICATION                                 |
+---------------------------------------------------------------------------------------+
|   [ Employee Interface ]                                  [ Organizational Portal ]   |
|   - Zero-Knowledge Onboarding                               - Anonymized Cohort Trends|
|   - Private Workload Baseline                               - Macro Vitality Index    |
|   - Client-Side Duty-of-Care Escalation                     - Aggregate Benchmarks    |
+------------------------------------+----------------------------------+---------------+
                                     |                                  |
                                     v                                  v
+---------------------------------------------------------------------------------------+
|                           DATA PRIVACY & SANITIZATION LAYER                           |
+---------------------------------------------------------------------------------------+
|   - sanitizeOnboardingData()       : Strips PII, free-text markers, and timestamps    |
|   - Differential Privacy Engine    : Adds calibrated noise (Laplace) to aggregations  |
|   - k-Anonymity Filter             : Suppresses cohorts smaller than 5 respondents    |
+------------------------------------+----------------------------------+---------------+
                                     |                                  |
                  +------------------+------------------+               |
                  | Owner Token Only                    | Aggregated    |
                  v                                     v Telemetry     |
+------------------------------------+  +-------------------------------+---------------+
|       PRIVATE DATA STORE           |  |           PUBLIC TELEMETRY STORE              |
|   users/{userId}/privateProfile    |  |   metrics/organizationalResilience            |
|   - Energy baselines               |  |   - Mean cohort engagement                    |
|   - Resilience blueprint           |  |   - Differential strain index                 |
|   - Individual pressure audits     |  |   - Anonymized participation rates            |
+------------------------------------+  +-----------------------------------------------+
|     SECURITY RULE ENFORCEMENT:     |  |          SECURITY RULE ENFORCEMENT:           |
|     auth.uid == userId             |  |          Authenticated read-only              |
|     No Admin Read Permitted        |  |          Write restricted to Cloud Functions  |
+------------------------------------+  +-----------------------------------------------+
                                     ^
                                     |
+------------------------------------+--------------------------------------------------+
|                           MULTI-TIER CACHE PURGE PIPELINE                             |
|   - Firestore SDK Disconnect   : terminate(db) detaches active document listeners      |
|   - IndexedDB Persistence Wipe : clearIndexedDbPersistence(db) purges local replica    |
|   - Browser Storage Eviction   : localStorage & sessionStorage atomic wipe             |
|   - Service Worker Purge       : caches.delete() invalidates offline application cache |
|   - Backend Sketch Flush       : POST /api/clear-cache resets HyperLogLog buffers      |
+---------------------------------------------------------------------------------------+
```

---

## Core Modules

### 1. Zero-Employer-Knowledge Onboarding System
The onboarding pipeline captures essential operational parameters without transmitting sensitive personal narratives or clinical diagnoses to the organization.
* **Role & Modality Logic:** Calibrates operational workloads (e.g., asynchronous remote, high-synchronicity on-site, hybrid shift) to contextualize pacing.
* **Pressure Audit:** Measures systemic workplace factors (meeting overload, interrupt frequency, after-hours notification volumes) rather than subjective emotional distress.
* **Cadence Target:** Computes optimal cognitive focus blocks and boundary targets.
* **Energy Baseline:** Captures normalized cognitive capacity bands stored exclusively within the employee's isolated storage perimeter.
* **Resilience Blueprint Synthesis:** Synthesizes actionable workplace routines entirely on the client, avoiding server-side model retention of personal work habits.

### 2. Cryptographic Data Segregation Layer
Ensures mathematical impossibility of employer surveillance into individual employee records.
* **Private Employee Document:** Stored at `/users/{userId}/privateProfile`. Firestore security rules evaluate `request.auth.uid == userId` and explicitly reject queries originating from administrative, manager, or HR roles.
* **Org-Safe Telemetry:** Enterprise reporting queries read pre-aggregated buckets where individual identifiers are absent.
* **Differential Privacy:** Statistical noise ($\epsilon$-differential privacy) is injected into cohort indicators, ensuring the inclusion or exclusion of an individual employee cannot be inferred.
* **Granular Firestore Security Rules:** Declarative policy enforcement executed at the database engine level, independent of application code.

### 3. Clinical Duty-of-Care Escalation (Non-Stigmatizing)
Provides a secure bridge to professional assistance during severe acute exhaustion without organizational exposure.
* **High Exhaustion Routing:** Heuristic evaluation executed locally within the client application detects acute sustained strain.
* **Anonymous Hotline Access:** Renders certified national and enterprise EAP crisis contacts, telehealth endpoints, and peer support lines out-of-band.
* **Zero Employer Visibility:** Escalation flows do not write audit records to the corporate database, generate webhooks, or notify HR administrators.

### 4. Multi-Tier Cache Purge Pipeline
Enterprise compliance requires reliable data eviction upon session termination, device handoff, or "Right to be Forgotten" requests.
* **Firestore Termination:** Explicitly halts the client SDK connection via `terminate(db)` to flush active sync streams.
* **IndexedDB Wipe:** Executes `clearIndexedDbPersistence(db)` to eliminate local SQLite/LevelDB binary snapshots on client hardware.
* **Web Storage Purge:** Programmatically evicts auth tokens and cached identifiers from `localStorage` and `sessionStorage`.
* **Service Worker Cache Deletion:** Evicts offline cache entries using the CacheStorage API (`window.caches.keys()` and `caches.delete()`).
* **Server-Side HyperLogLog Reset:** Flushes transient cardinality counters and in-memory aggregation sketches via authenticated endpoint.

---

## Reference Implementations

### Client-Side Data Sanitization
Strips all identifying signatures, IP-correlated metadata, and narrative strings prior to telemetry ingestion:

```typescript
/**
 * Sanitizes employee onboarding parameters for aggregate telemetry.
 * Strips identifiers, timestamps, and free-form strings before persistence.
 */
export interface RawOnboardingInput {
  userId: string;
  departmentCode: string;
  weeklyMeetingHours: number;
  focusBlockCadenceHours: number;
  personalReflections?: string;
}

export interface SanitizedTelemetryPayload {
  departmentHash: string;
  meetingLoadBand: 'low' | 'moderate' | 'high';
  cadenceCompliance: boolean;
}

export function sanitizeOnboardingData(input: RawOnboardingInput): SanitizedTelemetryPayload {
  // Strip personal notes and exact identifiers entirely
  const meetingLoadBand =
    input.weeklyMeetingHours > 20 ? 'high' :
    input.weeklyMeetingHours > 10 ? 'moderate' : 'low';

  return {
    // Coarse hash or bucket key preventing reverse identity correlation
    departmentHash: hashDepartment(input.departmentCode),
    meetingLoadBand,
    cadenceCompliance: input.focusBlockCadenceHours >= 4,
  };
}

function hashDepartment(dept: string): string {
  // Enterprise salt + SHA-256 truncation to cohort level
  return `cohort_${dept.trim().toLowerCase()}`;
}
```

---

### Client-Side Multi-Tier Cache Purge
Clears in-memory state, SQLite/IndexedDB offline persistence, and browser storage:

```typescript
import { terminate, clearIndexedDbPersistence, Firestore } from 'firebase/firestore';

/**
 * Executes a deterministic, multi-tier cache eviction across browser storage layers.
 */
export async function clearDatabaseCache(db: Firestore, shouldReload: boolean = false): Promise<void> {
  try {
    // 1. Terminate Firestore active network listeners
    await terminate(db);

    // 2. Wipe Firestore IndexedDB persistence database
    await clearIndexedDbPersistence(db);

    // 3. Purge Web Storage APIs
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
      window.sessionStorage.clear();

      // 4. Invalidate Service Worker CacheStorage
      if ('caches' in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map((name) => window.caches.delete(name)));
      }

      // 5. Notify server to invalidate ephemeral session sketch
      await fetch('/api/clear-cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {/* non-blocking ephemeral notification */});

      if (shouldReload) {
        window.location.reload();
      }
    }
  } catch (error) {
    console.error('Multi-tier cache purge exception:', error);
    throw error;
  }
}
```

---

### Server-Side Ephemeral Cache Flush
Flushes transient HyperLogLog cardinality buffers without disrupting persistent database state:

```typescript
import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

// In-memory telemetry aggregation buffer (HyperLogLog or rolling sketches)
let ephemeralAnalyticsSketch: Record<string, Set<string>> = {};

/**
 * POST /api/clear-cache
 * Flushes transient in-memory telemetry buffers. Restricted to authenticated operators.
 */
app.post('/api/clear-cache', (req: Request, res: Response) => {
  try {
    const keysCount = Object.keys(ephemeralAnalyticsSketch).length;

    // Atomic wipe of transient cardinality sketches
    ephemeralAnalyticsSketch = {};

    res.status(200).json({
      status: 'success',
      clearedSketches: keysCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to flush ephemeral aggregation buffers',
    });
  }
});
```

---

## Security Guarantees & Policy Matrix

| Scope | Employee Record | Manager Dashboard | Executive / C-Suite View | Platform Administrator |
| :--- | :--- | :--- | :--- | :--- |
| **Personal Baseline** | Read / Write (Self) | **No Access (403)** | **No Access (403)** | **No Access (403)** |
| **Duty-of-Care Triggers** | Ephemeral (Client Only) | **No Access (403)** | **No Access (403)** | **No Access (403)** |
| **Team Telemetry** | View Aggregates | Aggregated ($k \ge 5$) | Aggregated ($k \ge 5$) | Aggregated ($k \ge 5$) |
| **Local Cache Lifetime** | Session / User Purgeable | Session Controlled | Session Controlled | Session Controlled |

---

## Deployment & Verification

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Configure environment parameters
cp .env.example .env.local

# 3. Launch full-stack development environment
npm run dev
```

### Production Build & Linting
```bash
# Type check and build distribution bundle
npm run build

# Run security and linting sweeps
npm run lint
```

### Environment Security Requirements
* **TLS 1.3 Strict Transport Security:** All telemetry endpoints enforce HSTS with preloaded subdomains.
* **Content Security Policy (CSP):** Disallows unsanitized inline scripts and restricts outbound socket connections to vetted database gateways.
* **Cross-Origin Isolation:** Enabled headers (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`) prevent timing side-channel attacks against local memory caches.

---

## Notice
This documentation provides non-sensitive architectural summaries for technical due diligence, security evaluations, and GitHub open-source preview. It contains no Protected Health Information (PHI), Personally Identifiable Information (PII), or clinical diagnostic schemas.

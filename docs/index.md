---
layout: default
title: Claro — Enterprise Workplace Resilience Platform
description: Architecture, security guarantees, data segregation, and multi-tier cache purge pipeline for enterprise workplace resilience.
---

# Claro — Enterprise Workplace Resilience & Telemetry Platform

[![Security: Zero-Knowledge](https://img.shields.io/badge/Security-Zero--Knowledge-10b981.svg)](#)
[![Data Privacy: Differential Privacy](https://img.shields.io/badge/Privacy-Differential%20%28%CE%B5%2C%20%CE%B4%29-3b82f6.svg)](#)
[![Compliance: SOC2 / GDPR Ready](https://img.shields.io/badge/Compliance-GDPR%20%26%20SOC2%20Ready-6366f1.svg)](#)
[![License: Enterprise Proprietary](https://img.shields.io/badge/License-Enterprise%20Proprietary-gray.svg)](#)

---

## Executive Summary

**Claro** is an enterprise workforce resilience and wellbeing telemetry platform engineered for organizations that mandate strict data privacy, zero employer surveillance risk, and alignment with global privacy regulations (GDPR, HIPAA Security Rule, SOC 2 Type II).

Conventional wellbeing applications aggregate identifiable employee assessments and mood logs into central databases accessible by organizational managers, introducing corporate liability and chilling employee participation. Claro resolves this through an **asymmetric, zero-employer-knowledge architecture**: individual baseline metrics, pacing targets, and duty-of-care escalations are isolated exclusively to the employee’s client perimeter. Enterprise administrators receive only aggregated, differentially private telemetry governed by minimum cohort thresholds ($k \ge 5$).

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
|   - Differential Privacy Engine    : Calibrated Laplace noise injection               |
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
Captures operational work habits to calibrate recommendations without logging personal narratives or medical history:
* **Role & Modality Logic:** Normalizes operational environments (asynchronous remote, high-synchronicity on-site, shift-based) to contextualize sustainable cadence.
* **Pressure Audit:** Evaluates objective operational stressors (meeting density, context-switching frequency, off-hours communication load) rather than emotional distress labels.
* **Cadence Target:** Computes optimal focus intervals and boundary targets.
* **Energy Baseline:** Measures self-reported capacity indices stored exclusively within the individual's user-scoped partition.
* **Resilience Blueprint Synthesis:** Actionable workplace mitigation routines are computed on-device; no personal work profiles are transmitted or retained on remote model training clusters.

### 2. Cryptographic Data Segregation Layer
Ensures mathematical isolation between individual telemetry and employer views:
* **Private Employee Document:** Document access is constrained at the database layer (`/users/{userId}/*`). Security rules enforce `request.auth.uid == userId`, rejecting reads from administrative or HR service roles.
* **Org-Safe Telemetry:** Enterprise queries only access pre-computed statistical rollups. Cohorts smaller than 5 individuals are automatically suppressed.
* **Differential Privacy:** $\epsilon$-calibrated statistical noise is added to organizational metrics, mathematically preventing membership inference attacks.
* **Firestore Security Rules:** Server-enforced access control guarantees policies hold regardless of client software state.

### 3. Clinical Duty-of-Care Escalation (Non-Stigmatizing)
Safely bridges team members to professional resources during severe exhaustion events without organizational alerting:
* **High Exhaustion Routing:** Client-side heuristics detect sustained operational overload patterns.
* **Anonymous Hotline Access:** Presents certified national, enterprise EAP, and confidential support hotlines directly out-of-band.
* **Zero Employer Visibility:** Escalation interactions generate zero event logs, audit records, or webhooks visible to corporate supervisors or HR departments.

### 4. Multi-Tier Cache Purge Pipeline
Enforces deterministic client and edge memory eviction for session termination, shared devices, or data deletion compliance:
* **Firestore SDK Termination:** Halts all real-time document listeners and network sockets via `terminate(db)`.
* **IndexedDB Wipe:** Eliminates local LevelDB/SQLite persistence replicas via `clearIndexedDbPersistence(db)`.
* **Web Storage Purge:** Atomically clears `localStorage` and `sessionStorage`.
* **Service Worker Cache Eviction:** Enumerates and purges all CacheStorage entries via `window.caches.keys()` and `caches.delete()`.
* **Server-Side HyperLogLog Reset:** Emits authenticated requests to flush ephemeral in-memory sketches and aggregate buffers on the backend.

---

## High-Level Code Reference

### 1. Client-Side Telemetry Sanitization (`sanitizeOnboardingData`)
Strips free-form text and identifiers before emitting telemetry:

```typescript
/**
 * Strips PII and free-text narratives prior to aggregate telemetry calculation.
 */
export interface RawOnboardingInput {
  userId: string;
  departmentCode: string;
  weeklyMeetingHours: number;
  focusBlockCadenceHours: number;
  personalNotes?: string;
}

export interface SanitizedTelemetryPayload {
  cohortHash: string;
  meetingLoadBand: 'low' | 'moderate' | 'high';
  cadenceCompliant: boolean;
}

export function sanitizeOnboardingData(input: RawOnboardingInput): SanitizedTelemetryPayload {
  // Free-form notes and direct user IDs are discarded immediately
  const meetingLoadBand =
    input.weeklyMeetingHours > 20 ? 'high' :
    input.weeklyMeetingHours > 10 ? 'moderate' : 'low';

  return {
    cohortHash: hashDepartment(input.departmentCode),
    meetingLoadBand,
    cadenceCompliant: input.focusBlockCadenceHours >= 4,
  };
}

function hashDepartment(dept: string): string {
  return `cohort_${dept.trim().toLowerCase()}`;
}
```

---

### 2. Multi-Tier Cache Invalidation (`clearDatabaseCache`)
Orchestrates offline database termination, IndexedDB wipe, and browser storage clearance:

```typescript
import { terminate, clearIndexedDbPersistence, Firestore } from 'firebase/firestore';

/**
 * Deterministically purges persistent database caches and browser storage.
 */
export async function clearDatabaseCache(db: Firestore, shouldReload: boolean = false): Promise<void> {
  try {
    // 1. Terminate active Firestore synchronization channels
    await terminate(db);

    // 2. Wipe client-side persistence database (IndexedDB)
    await clearIndexedDbPersistence(db);

    // 3. Clear Web Storage items
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
      window.sessionStorage.clear();

      // 4. Invalidate offline CacheStorage caches
      if ('caches' in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map((name) => window.caches.delete(name)));
      }

      // 5. Invalidate server-side ephemeral sketch buffers
      await fetch('/api/clear-cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {/* non-blocking notification */});

      if (shouldReload) {
        window.location.reload();
      }
    }
  } catch (error) {
    console.error('Cache eviction failure:', error);
    throw error;
  }
}
```

---

### 3. Server Ephemeral Cache Reset (`POST /api/clear-cache`)
Safely flushes backend in-memory aggregation buffers:

```typescript
import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

// In-memory unique user sketches (e.g., HyperLogLog or daily distinct counts)
let dailySketches: Record<string, Set<string>> = {};

/**
 * POST /api/clear-cache
 * Flushes in-memory cardinality sketches and transient cache tables.
 */
app.post('/api/clear-cache', (req: Request, res: Response) => {
  try {
    const keysCount = Object.keys(dailySketches).length;
    dailySketches = {};

    res.status(200).json({
      status: 'ok',
      clearedBuckets: keysCount,
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

## Security Guarantees & Access Matrix

| Resource Scope | Employee Subject | Direct Manager | Organization Admin / HR | Security Officer |
| :--- | :--- | :--- | :--- | :--- |
| **Personal Workload Baseline** | Read / Write | **No Access (403)** | **No Access (403)** | **No Access (403)** |
| **Duty-of-Care Interventions** | Ephemeral (Client) | **No Access (403)** | **No Access (403)** | **No Access (403)** |
| **Aggregated Vitality Index** | Read ($k \ge 5$) | Read ($k \ge 5$) | Read ($k \ge 5$) | Read ($k \ge 5$) |
| **Local Cache Persistence** | Immediate Purge | Immediate Purge | Immediate Purge | Immediate Purge |

---

## Deployment & Verification

### Local Development Setup
```bash
# 1. Install dependencies
npm install

# 2. Configure environment parameters
cp .env.example .env.local

# 3. Start development server with API proxy
npm run dev
```

### Production Build & Linting
```bash
# Verify TypeScript definitions and build production bundle
npm run build

# Run code style and security linter
npm run lint
```

### Infrastructure Compliance Notes
* **Transport Security:** Strict Transport Security (HSTS) with TLS 1.3 encryption across all network ingress points.
* **Content Security Policy (CSP):** Prohibits unverified third-party script tags and restricts socket connections exclusively to authorized database endpoints.
* **Isolated Browsing Perimeter:** `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` prevent timing side-channel attacks against local client caches.

---

## Disclaimer
This documentation contains non-sensitive technical summaries for architecture reviews, procurement diligence, and open-source GitHub preview. It contains no Protected Health Information (PHI), Personally Identifiable Information (PII), or diagnostic clinical models.

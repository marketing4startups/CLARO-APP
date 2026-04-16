import { useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { HyperLogLog } from '../lib/hll';

/**
 * EphemeralTracker implements "Federated Analytics" using HyperLogLog.
 * It is physically incapable of storing personal data.
 * 
 * 1. The browser gets a time-locked token.
 * 2. The browser calculates an anonymous sketch locally.
 * 3. The browser sends only the aggregated result (sketch) to the server.
 */
export function EphemeralTracker() {
  useEffect(() => {
    async function track() {
      // 1. Respect User Choice (Do Not Track)
      if (navigator.doNotTrack === "1") return;

      try {
        // 2. Fetch a "Time-Locked Token" from the server for this hour.
        const response = await fetch('/api/get-token');
        if (!response.ok) return;
        const { timestamp, token } = await response.json();

        // 3. Create a unique-but-anonymous identifier for this page + time window.
        // Hashing ensures it's consistent but not reversible to the actual URL.
        const pageId = CryptoJS.SHA256(`${token}:${window.location.pathname}`).toString();

        // 4. Check if we've already processed this page in this time window.
        // We use sessionStorage, which is cleared when the browser closes.
        const storageKey = `ei-${timestamp}`;
        const processedPages = JSON.parse(sessionStorage.getItem(storageKey) || '{}');

        if (processedPages[pageId]) {
          return; // Already counted this page in this session.
        }

        // 5. It's a new page view for this session! Add it to the local HLL sketch.
        let hll = new HyperLogLog(10);

        // The "item" we add is a hash of pageId + a random session ID.
        // We don't have a user ID, so we use a session ID stored temporarily in sessionStorage.
        let sessionId = sessionStorage.getItem('ei-session') || Math.random().toString(36).substring(2);
        sessionStorage.setItem('ei-session', sessionId);

        const itemToAdd = CryptoJS.SHA256(`${pageId}:${sessionId}`).toString();
        hll.insert(itemToAdd);

        // 6. Serialize the HLL sketch to a string to send to the server.
        const sketchString = hll.toString();

        // 7. Send ONLY the sketch and timestamp back to the server.
        const payload = JSON.stringify({
          t: timestamp,
          s: sketchString
        });

        const blob = new Blob([payload], { type: 'application/json' });

        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/report', blob);
        } else {
          fetch('/api/report', {
            method: 'POST',
            body: blob,
            keepalive: true
          });
        }

        // 8. Mark this page as processed for this time window.
        processedPages[pageId] = true;
        sessionStorage.setItem(storageKey, JSON.stringify(processedPages));
      } catch (error) {
        // Fail silently to not impact user experience
        console.debug("Ephemeral Insights tracking suppressed:", error);
      }
    }

    track();
  }, []);

  return null;
}

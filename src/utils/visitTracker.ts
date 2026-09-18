// Utility for tracking and persisting actual exploration visit counts for 15 heritage sites
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'donggala_site_visit_counts_v2';
const EVENT_NAME = 'donggala_site_visit_updated';

// Get local stored counts
export function getStoredVisits(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Get exploration visit count for a site (starts at 0 and increments with each exploration)
export function getSiteVisitCount(siteId: string): number {
  const stored = getStoredVisits();
  return stored[siteId] || 0;
}

// Record exploration of a site (e.g. tur 360, detail, bicara AI, lensa waktu, atau eksplorasi peta)
export function recordSiteVisit(siteId: string): number {
  try {
    const stored = getStoredVisits();
    const newCount = (stored[siteId] || 0) + 1;
    stored[siteId] = newCount;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    // Notify all active listeners across the app
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(EVENT_NAME, {
          detail: { siteId, count: newCount }
        })
      );

      // Async sync with server endpoint (best-effort)
      fetch(`/api/visits/${encodeURIComponent(siteId)}`, { method: 'POST' }).catch(() => {});
    }

    return newCount;
  } catch (err) {
    console.warn('[visitTracker] Failed to record visit:', err);
    return 1;
  }
}

// Alias for backwards compatibility
export const recordSite360Visit = recordSiteVisit;

// Format count in Indonesian locale (e.g. 0, 1, 12, 1.450)
export function formatVisitCount(count: number): string {
  return new Intl.NumberFormat('id-ID').format(Math.max(0, count || 0));
}

// React hook to get reactive real-time visit count for a specific site
export function useSiteVisitCount(siteId: string): number {
  const [count, setCount] = useState<number>(() => getSiteVisitCount(siteId));

  useEffect(() => {
    setCount(getSiteVisitCount(siteId));

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ siteId: string; count: number }>;
      if (!customEvent.detail || customEvent.detail.siteId === siteId) {
        setCount(getSiteVisitCount(siteId));
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, [siteId]);

  return count;
}

// React hook to get all visit counts reactive map
export function useAllVisitCounts(): Record<string, number> {
  const [counts, setCounts] = useState<Record<string, number>>(() => getStoredVisits());

  useEffect(() => {
    const handleUpdate = () => {
      setCounts({ ...getStoredVisits() });
    };

    // Optionally fetch initial counts from server
    fetch('/api/visits')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.visits && typeof data.visits === 'object') {
          const local = getStoredVisits();
          const merged: Record<string, number> = { ...local };
          for (const [sId, sCount] of Object.entries(data.visits)) {
            merged[sId] = Math.max(merged[sId] || 0, Number(sCount) || 0);
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          setCounts(merged);
        }
      })
      .catch(() => {});

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, []);

  return counts;
}


import { useEffect, useState } from "react";
import { COUNTER_URL } from "../data/resume";

export interface VisitorStats {
  views: number | null;
  updatedAt: string | null;
  /** True once a fresh count has loaded — used to trigger the greeting toast. */
  ready: boolean;
}

interface CounterResponse {
  views: number;
  updatedAt?: string | null;
}

/**
 * Fetches the visitor count from the AWS Lambda counter. POSTs once per browser
 * session (incrementing the count), then GETs on subsequent loads. Returns the
 * view count plus the `updatedAt` timestamp from the richer Lambda payload.
 */
export function useVisitorCounter(): VisitorStats {
  const [stats, setStats] = useState<VisitorStats>({
    views: null,
    updatedAt: null,
    ready: false,
  });

  useEffect(() => {
    let cancelled = false;
    const alreadyCounted = sessionStorage.getItem("counterIncremented");
    const method = alreadyCounted ? "GET" : "POST";

    (async () => {
      try {
        const res = await fetch(COUNTER_URL, { method });
        if (!res.ok) throw new Error(`Counter request failed: ${res.status}`);
        const data: CounterResponse = await res.json();
        if (cancelled) return;
        setStats({
          views: data.views,
          updatedAt: data.updatedAt ?? null,
          ready: true,
        });
        if (method === "POST") {
          sessionStorage.setItem("counterIncremented", "true");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Visitor counter error:", err);
        setStats({ views: 0, updatedAt: null, ready: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}

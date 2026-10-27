"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchCelebrationsClient, isCancelledRequest } from "@/lib/fetchCalls/fetchCelebrationsClient";

// Client-side paging for a celebrations list. The address bar is never touched: page 1 comes from the
// server as `initialData`, later pages / tabs are fetched here and swapped in. A failed fetch leaves the
// page on screen as it was. Callers that mirror the filters into the address bar (the album page) do it themselves.
export default function useCelebrationPager({ path, initialData, limit, initialParams = {} }) {
  const [data, setData] = useState(initialData);
  const [params, setParams] = useState(initialParams); // extra params (e.g. type) of the data on screen
  const [loading, setLoading] = useState(false);

  const requestId = useRef(0);
  const controller = useRef(null);

  useEffect(() => () => controller.current?.abort(), []);

  const load = useCallback(
    async (page, extra = {}) => {
      controller.current?.abort();
      const current = new AbortController();
      controller.current = current;
      const id = ++requestId.current;

      setLoading(true);
      try {
        const next = await fetchCelebrationsClient(path, { page, limit, ...extra }, current.signal);
        if (id !== requestId.current) return; // a newer request superseded this one
        setData(next);
        setParams(extra);
      } catch (err) {
        if (id !== requestId.current || isCancelledRequest(err)) return;
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [path, limit]
  );

  return { data, params, loading, load };
}

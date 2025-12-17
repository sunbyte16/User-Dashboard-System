import React, { useEffect, useState } from "react";

export default function ApiStatus() {
  const [online, setOnline] = useState(null);
  useEffect(() => {
    let done = false;
    const ctrl = new AbortController();
    const url = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000") + "/auth/refresh";
    const timer = setTimeout(() => ctrl.abort(), 2500);
    fetch(url, { method: "POST", credentials: "include", signal: ctrl.signal })
      .then(() => { if (!done) setOnline(true); })
      .catch(() => { if (!done) setOnline(false); })
      .finally(() => { done = true; clearTimeout(timer); });
    return () => { done = true; clearTimeout(timer); ctrl.abort(); };
  }, []);
  return (
    <div className="status">
      <span className="badge" style={{ background:"rgba(59,130,246,.15)", color:"#93c5fd" }}>Frontend: Ready</span>
      {online === null && <span className="badge" style={{ background:"rgba(148,163,184,.15)", color:"#cbd5e1" }}>API: Checking…</span>}
      {online === true && <span className="badge success">API: Connected</span>}
      {online === false && <span className="badge danger">API: Offline</span>}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { reportWebVitals } from "@/lib/web-vitals";

/**
 * Web Vitals monitoring component for Phase 0 baseline collection
 * Automatically reports Core Web Vitals metrics during development
 */
export function WebVitalsReporter() {
  useEffect(() => {
    // Dynamically import web-vitals to avoid SSR issues
    import("web-vitals").then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      onCLS(reportWebVitals);
      onFCP(reportWebVitals);
      onINP(reportWebVitals); // FID has been replaced with INP (Interaction to Next Paint)
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
    });
  }, []);

  // Log baseline collection info in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("📊 Phase 0: Web Vitals baseline collection active");
      console.log("💡 Check console for Core Web Vitals metrics");
      console.log("📈 Metrics are stored in localStorage for analysis");
    }
  }, []);

  return null; // This component doesn't render anything
}

export default WebVitalsReporter;

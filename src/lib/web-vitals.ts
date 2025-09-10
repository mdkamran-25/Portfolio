/**
 * Web Vitals monitoring utility for Phase 0 baseline measurement
 * Logs Core Web Vitals metrics to console for development analysis
 */

export interface WebVitalMetric {
  name: "CLS" | "FCP" | "INP" | "LCP" | "TTFB";
  value: number;
  id: string;
  delta: number;
  entries: PerformanceEntry[];
}

/**
 * Logs Web Vitals metrics to console during development
 * Will be replaced with proper analytics in future phases
 */
export function reportWebVitals(metric: WebVitalMetric) {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment) {
    console.group(`🔍 Web Vital: ${metric.name}`);
    console.log(`Value: ${metric.value}`);
    console.log(`ID: ${metric.id}`);
    console.log(`Delta: ${metric.delta}`);

    // Add color coding for metric health
    const getMetricStatus = (name: string, value: number): string => {
      switch (name) {
        case "LCP":
          return value <= 2500 ? "✅ Good" : value <= 4000 ? "⚠️ Needs Improvement" : "❌ Poor";
        case "INP":
          return value <= 200 ? "✅ Good" : value <= 500 ? "⚠️ Needs Improvement" : "❌ Poor";
        case "CLS":
          return value <= 0.1 ? "✅ Good" : value <= 0.25 ? "⚠️ Needs Improvement" : "❌ Poor";
        case "FCP":
          return value <= 1800 ? "✅ Good" : value <= 3000 ? "⚠️ Needs Improvement" : "❌ Poor";
        case "TTFB":
          return value <= 800 ? "✅ Good" : value <= 1800 ? "⚠️ Needs Improvement" : "❌ Poor";
        default:
          return "Unknown";
      }
    };

    console.log(`Status: ${getMetricStatus(metric.name, metric.value)}`);
    console.groupEnd();
  }

  // Store metrics for Phase 0 baseline analysis
  if (typeof window !== "undefined") {
    const baseline = JSON.parse(localStorage.getItem("phase0-baseline") || "{}");
    baseline[metric.name] = {
      value: metric.value,
      timestamp: Date.now(),
      page: window.location.pathname,
    };
    localStorage.setItem("phase0-baseline", JSON.stringify(baseline));
  }
}

/**
 * Get baseline metrics for analysis
 */
export function getBaselineMetrics() {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("phase0-baseline") || "{}");
  }
  return {};
}

/**
 * Clear baseline metrics
 */
export function clearBaselineMetrics() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("phase0-baseline");
  }
}

/**
 * Export baseline metrics as JSON for documentation
 */
export function exportBaselineMetrics() {
  const metrics = getBaselineMetrics();
  const blob = new Blob([JSON.stringify(metrics, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `phase0-baseline-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

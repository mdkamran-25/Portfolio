/**
 * Color Contrast Audit Runner
 *
 * Executes the WCAG 2.1 AA color contrast audit and generates a report
 */

import {
  auditColorContrast,
  generateAccessibilityReport,
} from "@/shared/utils/color-contrast-audit";

// Run the audit
const auditResults = auditColorContrast();
const report = generateAccessibilityReport();

console.log("=".repeat(80));
console.log("WCAG 2.1 AA COLOR CONTRAST AUDIT RESULTS");
console.log("=".repeat(80));

console.log(`\n📊 SUMMARY:`);
console.log(`Total combinations: ${auditResults.summary.total}`);
console.log(`✅ Passing: ${auditResults.summary.passing}`);
console.log(`⚠️  Warning: ${auditResults.summary.warning}`);
console.log(`❌ Failing: ${auditResults.summary.failing}`);

const passRate = Math.round((auditResults.summary.passing / auditResults.summary.total) * 100);
console.log(`\n🎯 Overall compliance rate: ${passRate}%\n`);

// Show detailed results
console.log("📋 DETAILED RESULTS:\n");

auditResults.results.forEach((result, index) => {
  const status = result.status === "PASS" ? "✅" : result.status === "WARNING" ? "⚠️" : "❌";
  console.log(`${index + 1}. ${status} ${result.name}`);
  console.log(`   Context: ${result.context}`);
  console.log(`   Normal text: ${result.normal.ratio}:1 (${result.normal.level})`);
  console.log(`   Large text: ${result.large.ratio}:1 (${result.large.level})`);
  console.log("");
});

// Export report to write to file
export default report;

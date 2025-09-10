#!/usr/bin/env node

/**
 * Phase 0 - Tailwind Class Duplication Analysis Script
 * Analyzes codebase for repeated Tailwind class patterns
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class TailwindAnalyzer {
  constructor() {
    this.classPatterns = new Map();
    this.filePatterns = new Map();
    this.componentClasses = new Map();
  }

  // Extract Tailwind classes from a string
  extractTailwindClasses(content) {
    const classRegex = /className\s*=\s*["`']([^"`']*)["`']/g;
    const classes = [];
    let match;
    
    while ((match = classRegex.exec(content)) !== null) {
      const classList = match[1];
      classes.push(...classList.split(/\s+/).filter(cls => cls.trim()));
    }
    
    return classes;
  }

  // Analyze a single file
  analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const classes = this.extractTailwindClasses(content);
      
      // Track classes by frequency
      classes.forEach(cls => {
        if (!this.classPatterns.has(cls)) {
          this.classPatterns.set(cls, { count: 0, files: new Set() });
        }
        this.classPatterns.get(cls).count++;
        this.classPatterns.get(cls).files.add(filePath);
      });

      // Track class combinations (common patterns)
      const classString = classes.join(' ');
      if (classString.length > 10) {
        if (!this.filePatterns.has(classString)) {
          this.filePatterns.set(classString, { count: 0, files: new Set() });
        }
        this.filePatterns.get(classString).count++;
        this.filePatterns.get(classString).files.add(filePath);
      }

      return classes;
    } catch (error) {
      console.warn(`Warning: Could not analyze ${filePath}:`, error.message);
      return [];
    }
  }

  // Analyze all relevant files
  analyzeProject() {
    const patterns = [
      'src/**/*.tsx',
      'src/**/*.jsx',
      'src/**/*.ts',
      'src/**/*.js'
    ];

    patterns.forEach(pattern => {
      const files = glob.sync(pattern, { cwd: process.cwd() });
      files.forEach(file => {
        const fullPath = path.resolve(file);
        this.analyzeFile(fullPath);
      });
    });
  }

  // Generate analysis report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalUniqueClasses: this.classPatterns.size,
        totalFiles: new Set([...this.classPatterns.values()].flatMap(p => [...p.files])).size,
        mostCommonClasses: [...this.classPatterns.entries()]
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 20),
        duplicatedPatterns: [...this.filePatterns.entries()]
          .filter(([pattern, data]) => data.count > 1)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 10)
      }
    };

    // Identify optimization opportunities
    report.optimizationOpportunities = this.identifyOptimizations();

    return report;
  }

  // Identify patterns that should be extracted to design tokens
  identifyOptimizations() {
    const opportunities = [];

    // Color patterns
    const colorClasses = [...this.classPatterns.entries()]
      .filter(([cls]) => cls.includes('text-') || cls.includes('bg-') || cls.includes('border-'))
      .filter(([cls, data]) => data.count >= 5)
      .sort((a, b) => b[1].count - a[1].count);

    opportunities.push({
      category: 'Color System',
      description: 'Frequently used colors that should become design tokens',
      classes: colorClasses.slice(0, 10),
      impact: 'High',
      recommendation: 'Extract to semantic color tokens'
    });

    // Spacing patterns  
    const spacingClasses = [...this.classPatterns.entries()]
      .filter(([cls]) => cls.includes('p-') || cls.includes('m-') || cls.includes('gap-'))
      .filter(([cls, data]) => data.count >= 3)
      .sort((a, b) => b[1].count - a[1].count);

    opportunities.push({
      category: 'Spacing System',
      description: 'Repeated spacing patterns',
      classes: spacingClasses.slice(0, 10),
      impact: 'Medium',
      recommendation: 'Standardize spacing scale'
    });

    // Component patterns
    const componentPatterns = [...this.filePatterns.entries()]
      .filter(([pattern, data]) => data.count >= 3 && pattern.length > 30)
      .slice(0, 5);

    opportunities.push({
      category: 'Component Patterns',
      description: 'Class combinations that appear multiple times',
      patterns: componentPatterns,
      impact: 'High', 
      recommendation: 'Extract to reusable components'
    });

    return opportunities;
  }

  // Save report to file
  saveReport(report) {
    const fileName = `phase0-tailwind-analysis-${Date.now()}.json`;
    const filePath = path.join(process.cwd(), 'docs', fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
    console.log(`📊 Tailwind analysis report saved to: ${filePath}`);
    
    // Also save a human-readable summary
    this.saveReadableReport(report);
  }

  // Save human-readable report
  saveReadableReport(report) {
    const fileName = `TAILWIND_ANALYSIS.md`;
    const filePath = path.join(process.cwd(), 'docs', fileName);
    
    let content = `# Tailwind CSS Class Analysis - Phase 0\n\n`;
    content += `**Generated:** ${report.timestamp}\n\n`;
    
    content += `## Summary\n`;
    content += `- **Total Unique Classes:** ${report.summary.totalUniqueClasses}\n`;
    content += `- **Files Analyzed:** ${report.summary.totalFiles}\n\n`;
    
    content += `## Most Common Classes\n`;
    content += `| Class | Count | Files |\n`;
    content += `|-------|-------|-------|\n`;
    report.summary.mostCommonClasses.forEach(([cls, data]) => {
      content += `| \`${cls}\` | ${data.count} | ${data.files.size} |\n`;
    });
    
    content += `\n## Optimization Opportunities\n`;
    report.optimizationOpportunities.forEach(opp => {
      content += `\n### ${opp.category} (${opp.impact} Impact)\n`;
      content += `${opp.description}\n\n`;
      content += `**Recommendation:** ${opp.recommendation}\n\n`;
      
      if (opp.classes) {
        content += `| Class | Usage Count |\n|-------|-------------|\n`;
        opp.classes.slice(0, 5).forEach(([cls, data]) => {
          content += `| \`${cls}\` | ${data.count} |\n`;
        });
      }
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`📋 Human-readable report saved to: ${filePath}`);
  }
}

// Run analysis if called directly
if (require.main === module) {
  console.log('🔍 Starting Tailwind CSS class analysis...');
  
  const analyzer = new TailwindAnalyzer();
  analyzer.analyzeProject();
  const report = analyzer.generateReport();
  analyzer.saveReport(report);
  
  console.log('\n✅ Analysis complete!');
  console.log(`Found ${report.summary.totalUniqueClasses} unique classes across ${report.summary.totalFiles} files`);
  console.log(`Identified ${report.optimizationOpportunities.length} optimization opportunities`);
}

module.exports = { TailwindAnalyzer };

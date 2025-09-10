#!/usr/bin/env node

/**
 * Complete Test Runner for Portfolio Application
 * 
 * Runs all types of tests in the correct order:
 * 1. Type checking
 * 2. Linting
 * 3. Unit tests
 * 4. E2E tests
 */

const { execSync } = require('child_process');
const path = require('path');

// ANSI color codes for output formatting
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, description) {
  log(`\n${colors.bright}${colors.blue}📋 Step ${step}: ${description}${colors.reset}`);
}

function logSuccess(message) {
  log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logWarning(message) {
  log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function runCommand(command, description, { optional = false, showOutput = true } = {}) {
  try {
    log(`${colors.cyan}Running: ${command}${colors.reset}`);
    
    const options = {
      stdio: showOutput ? 'inherit' : 'pipe',
      cwd: process.cwd(),
    };
    
    const result = execSync(command, options);
    logSuccess(`${description} completed successfully`);
    return { success: true, output: result };
  } catch (error) {
    if (optional) {
      logWarning(`${description} failed (optional): ${error.message}`);
      return { success: false, error, optional: true };
    } else {
      logError(`${description} failed: ${error.message}`);
      return { success: false, error };
    }
  }
}

async function main() {
  log(`${colors.bright}${colors.magenta}🚀 Running Complete Test Suite for Portfolio Application${colors.reset}`);
  log(`${colors.bright}Time: ${new Date().toISOString()}${colors.reset}\n`);

  const testResults = {
    typeCheck: false,
    lint: false,
    unitTests: false,
    e2eTests: false,
  };

  let totalSteps = 4;
  let currentStep = 1;

  try {
    // Step 1: Type Checking
    logStep(currentStep++, 'TypeScript Type Checking');
    const typeCheck = runCommand('npm run type-check', 'TypeScript type checking');
    testResults.typeCheck = typeCheck.success;

    if (!typeCheck.success) {
      logError('Type checking failed. Please fix TypeScript errors before continuing.');
      process.exit(1);
    }

    // Step 2: Linting
    logStep(currentStep++, 'ESLint Code Quality Check');
    const lint = runCommand('npm run lint', 'ESLint checking');
    testResults.lint = lint.success;

    if (!lint.success) {
      logWarning('Linting failed. Attempting to auto-fix...');
      const lintFix = runCommand('npm run lint:fix', 'ESLint auto-fix', { optional: true });
      
      if (lintFix.success) {
        logSuccess('Auto-fix completed. Re-running lint check...');
        const lintRecheck = runCommand('npm run lint', 'ESLint re-check');
        testResults.lint = lintRecheck.success;
      }
    }

    // Step 3: Unit Tests
    logStep(currentStep++, 'Unit Tests with Coverage');
    const unitTests = runCommand('npm run test:coverage', 'Unit tests with coverage');
    testResults.unitTests = unitTests.success;

    if (!unitTests.success) {
      logError('Unit tests failed. Please fix failing tests before running E2E tests.');
      // Don't exit here, allow E2E tests to run for complete feedback
    }

    // Step 4: E2E Tests
    logStep(currentStep++, 'End-to-End Tests');
    log(`${colors.yellow}Starting development server for E2E tests...${colors.reset}`);
    
    const e2eTests = runCommand('npm run test:e2e', 'End-to-end tests');
    testResults.e2eTests = e2eTests.success;

    // Results Summary
    log(`\n${colors.bright}${colors.magenta}📊 Test Results Summary${colors.reset}`);
    log('━'.repeat(50));
    
    const results = [
      { name: 'TypeScript Type Check', success: testResults.typeCheck },
      { name: 'ESLint Code Quality', success: testResults.lint },
      { name: 'Unit Tests', success: testResults.unitTests },
      { name: 'E2E Tests', success: testResults.e2eTests },
    ];

    results.forEach(result => {
      const status = result.success ? '✅ PASS' : '❌ FAIL';
      const color = result.success ? colors.green : colors.red;
      log(`${color}${status}${colors.reset} ${result.name}`);
    });

    const totalPassed = results.filter(r => r.success).length;
    const totalTests = results.length;

    log('━'.repeat(50));
    
    if (totalPassed === totalTests) {
      log(`${colors.bright}${colors.green}🎉 ALL TESTS PASSED! (${totalPassed}/${totalTests})${colors.reset}`);
      log(`${colors.green}Your portfolio application is ready for deployment!${colors.reset}`);
    } else {
      log(`${colors.bright}${colors.red}❌ ${totalTests - totalPassed} test(s) failed (${totalPassed}/${totalTests} passed)${colors.reset}`);
      log(`${colors.red}Please fix the failing tests before deployment.${colors.reset}`);
    }

    // Additional Information
    log(`\n${colors.bright}${colors.cyan}📝 Additional Commands:${colors.reset}`);
    log(`${colors.cyan}  View E2E test report:     npm run test:e2e:report${colors.reset}`);
    log(`${colors.cyan}  Run E2E tests in UI mode: npm run test:e2e:ui${colors.reset}`);
    log(`${colors.cyan}  Debug E2E tests:          npm run test:e2e:debug${colors.reset}`);
    log(`${colors.cyan}  Run specific test file:   npm run test:e2e tests/e2e/navigation.spec.ts${colors.reset}`);

    // Exit with appropriate code
    process.exit(totalPassed === totalTests ? 0 : 1);

  } catch (error) {
    logError(`Unexpected error during test execution: ${error.message}`);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log(`\n${colors.yellow}Test execution interrupted by user${colors.reset}`);
  process.exit(1);
});

process.on('SIGTERM', () => {
  log(`\n${colors.yellow}Test execution terminated${colors.reset}`);
  process.exit(1);
});

// Run the main function
main().catch(error => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});

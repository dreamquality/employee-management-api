#!/usr/bin/env node

/**
 * Script to analyze API endpoint usage between backend and frontend
 * This script identifies all backend API endpoints and checks which ones are used by the frontend
 */

const fs = require('fs');
const path = require('path');

// Backend routes directory
const ROUTES_DIR = path.join(__dirname, 'routes');

// Frontend services directory
const FRONTEND_SERVICES_DIR = path.join(__dirname, 'frontend', 'src', 'services');

// Parse backend routes to extract all API endpoints
function parseBackendEndpoints() {
  const endpoints = [];
  const routeFiles = fs.readdirSync(ROUTES_DIR).filter(f => f.endsWith('.js'));

  routeFiles.forEach(file => {
    const content = fs.readFileSync(path.join(ROUTES_DIR, file), 'utf8');
    const lines = content.split('\n');

    lines.forEach(line => {
      // Match router.METHOD('path', ...)
      const match = line.match(/router\.(get|post|put|patch|delete)\s*\(\s*['"]([^'"]+)['"]/);
      if (match) {
        const method = match[1].toUpperCase();
        const endpoint = match[2];
        endpoints.push({
          method,
          path: endpoint,
          file,
          fullPath: endpoint
        });
      }
    });
  });

  return endpoints;
}

// Parse frontend services to extract all API calls
function parseFrontendApiCalls() {
  const apiCalls = [];
  const serviceFiles = fs.readdirSync(FRONTEND_SERVICES_DIR).filter(f => f.endsWith('.js'));

  serviceFiles.forEach(file => {
    const content = fs.readFileSync(path.join(FRONTEND_SERVICES_DIR, file), 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Match api.METHOD('path' or api.METHOD(`path`)
      const match = line.match(/api\.(get|post|put|patch|delete)\s*\(\s*[`'"]([^`'"]+)[`'"]/);
      if (match) {
        const method = match[1].toUpperCase();
        let endpoint = match[2];
        
        // Handle template literals with variables
        // e.g., `/users/${id}` becomes `/users/:id`
        endpoint = endpoint.replace(/\$\{[^}]+\}/g, ':id');
        
        apiCalls.push({
          method,
          path: endpoint,
          file,
          line: index + 1,
          originalLine: line.trim()
        });
      }
    });
  });

  return apiCalls;
}

// Normalize endpoint paths for comparison
function normalizePath(path) {
  // Replace path parameters with a common pattern
  return path.replace(/:\w+/g, ':param');
}

// Check if a backend endpoint is used by frontend
function isEndpointUsed(backendEndpoint, frontendCalls) {
  const normalizedBackendPath = normalizePath(backendEndpoint.path);
  
  return frontendCalls.some(call => {
    const normalizedFrontendPath = normalizePath(call.path);
    return (
      backendEndpoint.method === call.method &&
      normalizedBackendPath === normalizedFrontendPath
    );
  });
}

// Generate report
function generateReport() {
  const backendEndpoints = parseBackendEndpoints();
  const frontendCalls = parseFrontendApiCalls();

  console.log('\n=== API ENDPOINT USAGE ANALYSIS ===\n');
  console.log(`Total Backend Endpoints: ${backendEndpoints.length}`);
  console.log(`Total Frontend API Calls: ${frontendCalls.length}\n`);

  // Group endpoints by usage
  const usedEndpoints = [];
  const unusedEndpoints = [];

  backendEndpoints.forEach(endpoint => {
    if (isEndpointUsed(endpoint, frontendCalls)) {
      usedEndpoints.push(endpoint);
    } else {
      unusedEndpoints.push(endpoint);
    }
  });

  console.log('=== USED ENDPOINTS (' + usedEndpoints.length + ') ===\n');
  usedEndpoints.forEach(ep => {
    console.log(`✓ ${ep.method.padEnd(7)} ${ep.path.padEnd(40)} (${ep.file})`);
  });

  console.log('\n=== UNUSED ENDPOINTS (' + unusedEndpoints.length + ') ===\n');
  unusedEndpoints.forEach(ep => {
    console.log(`✗ ${ep.method.padEnd(7)} ${ep.path.padEnd(40)} (${ep.file})`);
  });

  console.log('\n=== FRONTEND API CALLS ===\n');
  frontendCalls.forEach(call => {
    console.log(`  ${call.method.padEnd(7)} ${call.path.padEnd(40)} (${call.file}:${call.line})`);
  });

  // Generate markdown report
  const markdownReport = generateMarkdownReport(backendEndpoints, frontendCalls, usedEndpoints, unusedEndpoints);
  fs.writeFileSync('api-usage-report.md', markdownReport);
  console.log('\n✓ Detailed report saved to api-usage-report.md\n');
}

function generateMarkdownReport(backendEndpoints, frontendCalls, usedEndpoints, unusedEndpoints) {
  let md = '# API Endpoint Usage Report\n\n';
  md += `Generated: ${new Date().toISOString()}\n\n`;
  
  md += '## Summary\n\n';
  md += `- **Total Backend Endpoints**: ${backendEndpoints.length}\n`;
  md += `- **Used by Frontend**: ${usedEndpoints.length} (${Math.round(usedEndpoints.length / backendEndpoints.length * 100)}%)\n`;
  md += `- **Unused by Frontend**: ${unusedEndpoints.length} (${Math.round(unusedEndpoints.length / backendEndpoints.length * 100)}%)\n`;
  md += `- **Total Frontend API Calls**: ${frontendCalls.length}\n\n`;

  md += '## Used Endpoints ✓\n\n';
  md += 'These endpoints are implemented in the backend and actively used by the frontend.\n\n';
  md += '| Method | Endpoint | Backend File |\n';
  md += '|--------|----------|-------------|\n';
  usedEndpoints.forEach(ep => {
    md += `| ${ep.method} | \`${ep.path}\` | ${ep.file} |\n`;
  });

  md += '\n## Unused Endpoints ✗\n\n';
  md += 'These endpoints are implemented in the backend but NOT used by the frontend.\n\n';
  
  if (unusedEndpoints.length === 0) {
    md += '**All endpoints are in use! 🎉**\n\n';
  } else {
    md += '| Method | Endpoint | Backend File |\n';
    md += '|--------|----------|-------------|\n';
    unusedEndpoints.forEach(ep => {
      md += `| ${ep.method} | \`${ep.path}\` | ${ep.file} |\n`;
    });
  }

  md += '\n## Frontend API Calls\n\n';
  md += 'All API calls made from the frontend services.\n\n';
  md += '| Method | Endpoint | Frontend File | Line |\n';
  md += '|--------|----------|---------------|------|\n';
  frontendCalls.forEach(call => {
    md += `| ${call.method} | \`${call.path}\` | ${call.file} | ${call.line} |\n`;
  });

  md += '\n## Details\n\n';
  md += '### Backend Route Files\n\n';
  const routeFiles = [...new Set(backendEndpoints.map(ep => ep.file))];
  routeFiles.forEach(file => {
    const fileEndpoints = backendEndpoints.filter(ep => ep.file === file);
    md += `#### ${file}\n\n`;
    fileEndpoints.forEach(ep => {
      const isUsed = usedEndpoints.includes(ep);
      md += `- ${isUsed ? '✓' : '✗'} \`${ep.method} ${ep.path}\`\n`;
    });
    md += '\n';
  });

  md += '### Frontend Service Files\n\n';
  const serviceFiles = [...new Set(frontendCalls.map(call => call.file))];
  serviceFiles.forEach(file => {
    const fileCalls = frontendCalls.filter(call => call.file === file);
    md += `#### ${file}\n\n`;
    fileCalls.forEach(call => {
      md += `- \`${call.method} ${call.path}\` (line ${call.line})\n`;
    });
    md += '\n';
  });

  return md;
}

// Run the analysis
try {
  generateReport();
} catch (error) {
  console.error('Error during analysis:', error);
  process.exit(1);
}

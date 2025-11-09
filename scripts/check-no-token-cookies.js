#!/usr/bin/env node
/**
 * CI script to check for getTokenFromCookies usage in client bundles
 * This script should be run in CI to fail builds if getTokenFromCookies is referenced
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  '.git',
  'lib/auth-cookies.ts', // The deprecated file itself
  '.test.',
  '.spec.',
];

const SEARCH_DIRS = ['lib', 'app', 'components'];

function checkForTokenCookies() {
  console.log('Checking for getTokenFromCookies references in client code...');

  const files = [];
  for (const dir of SEARCH_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const result = execSync(
      `grep -r "getTokenFromCookies" ${dir} --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" || true`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    if (result.trim()) {
      result
        .split('\n')
        .filter((line) => line.trim())
        .forEach((line) => {
          const filePath = line.split(':')[0];
          if (
            !EXCLUDE_PATTERNS.some((pattern) => filePath.includes(pattern))
          ) {
            files.push(line);
          }
        });
    }
  }

  if (files.length > 0) {
    console.error('❌ ERROR: Found getTokenFromCookies references in client code:');
    files.forEach((file) => console.error(file));
    console.error('');
    console.error(
      'Client-side code must NOT read tokens from cookies (XSS exposure).'
    );
    console.error(
      'Use internal API routes (/api/*) instead, which handle authentication server-side.'
    );
    process.exit(1);
  }

  console.log('✅ No getTokenFromCookies references found in client code.');
  process.exit(0);
}

checkForTokenCookies();


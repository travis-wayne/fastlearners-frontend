#!/bin/bash
# CI script to check for getTokenFromCookies usage in client bundles
# This script should be run in CI to fail builds if getTokenFromCookies is referenced

set -e

echo "Checking for getTokenFromCookies references in client code..."

# Search for getTokenFromCookies usage (excluding the deprecated file itself and test files)
FOUND=$(grep -r "getTokenFromCookies" \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir="node_modules" \
  --exclude-dir=".next" \
  --exclude-dir=".git" \
  lib/ app/ components/ \
  2>/dev/null | grep -v "lib/auth-cookies.ts" | grep -v "\.test\." | grep -v "\.spec\." || true)

if [ -n "$FOUND" ]; then
  echo "❌ ERROR: Found getTokenFromCookies references in client code:"
  echo "$FOUND"
  echo ""
  echo "Client-side code must NOT read tokens from cookies (XSS exposure)."
  echo "Use internal API routes (/api/*) instead, which handle authentication server-side."
  exit 1
fi

echo "✅ No getTokenFromCookies references found in client code."
exit 0


#!/usr/bin/env bash
# Format TS sources with Prettier.
set -euo pipefail
cd "$(dirname "$0")"
npx --yes prettier@3.3.3 --write \
  'src/**/*.{ts,tsx,js,jsx,json}' \
  '*.{json,md}'

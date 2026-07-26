#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
[ -d node_modules/jsdom ] || npm install jsdom --no-audit --no-fund --silent
node tests/run.js

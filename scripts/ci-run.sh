#!/usr/bin/env bash
# Runs a CI command and, if it fails, posts the important log lines as an
# error annotation so the failure is readable from the run summary.
name="$1"; shift
log="$(mktemp)"
set +e
"$@" 2>&1 | tee "$log"
code=${PIPESTATUS[0]}
if [ "$code" -ne 0 ]; then
  clean="$log.clean"
  sed 's/\x1b\[[0-9;]*m//g' "$log" > "$clean"
  # Real errors first (compiler errors, Gradle "What went wrong"), then the tail.
  {
    first=$(grep -nE 'ERROR|Error:|error:' "$clean" | grep -v ':w: ' | head -n1 | cut -d: -f1)
    if [ -n "$first" ]; then sed -n "$((first>8?first-8:1)),$((first+25))p" "$clean"; fi
    echo "----- matches -----"
    grep -nE '^e: |error:|ERROR|What went wrong|Execution failed|Could not|FAILURE|Caused by|Unresolved reference|> Task .* FAILED' "$clean" | grep -v '^[0-9]*:w: ' | head -n 15
    echo "----- tail -----"
    grep -v '^w: ' "$clean" | tail -n 25
  } | cut -c1-400 > "$log.report"
  body=$(awk '{printf "%s%%0A", $0}' "$log.report")
  echo "::error title=${name} failed::${body}"
fi
exit "$code"

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
    grep -nE '^e: |error:|ERROR|What went wrong|Execution failed|Could not|FAILURE|Caused by|Unresolved reference|> Task .* FAILED' "$clean" | grep -v '^[0-9]*:w: ' | head -n 30
    echo "----- tail -----"
    grep -v '^w: ' "$clean" | tail -n 25
  } | cut -c1-400 > "$log.report"
  body=$(awk '{printf "%s%%0A", $0}' "$log.report")
  echo "::error title=${name} failed::${body}"
fi
exit "$code"

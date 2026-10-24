#!/usr/bin/env bash
# Runs a CI command and, if it fails, posts the last log lines as an error
# annotation so the failure is readable from the run summary.
name="$1"; shift
log="$(mktemp)"
set +e
"$@" 2>&1 | tee "$log"
code=${PIPESTATUS[0]}
if [ "$code" -ne 0 ]; then
  tail -n 40 "$log" | sed 's/\x1b\[[0-9;]*m//g' | cut -c1-300 > "$log.tail"
  body=$(awk '{printf "%s%%0A", $0}' "$log.tail")
  echo "::error title=${name} failed::${body}"
fi
exit "$code"

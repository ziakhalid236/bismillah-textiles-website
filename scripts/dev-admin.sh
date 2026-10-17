#!/usr/bin/env bash
set -euo pipefail

env_file="${ADMIN_ENV_FILE:-.env.admin.local}"
if [[ ! -f "$env_file" ]]; then
  printf 'Missing %s. Configure local admin credentials first.\n' "$env_file" >&2
  exit 1
fi

set -a
source "$env_file"
set +a

api_port="${API_PORT:-3000}"
web_port="${WEB_PORT:-5000}"
export NODE_ENV=development

PORT="$api_port" pnpm --filter @workspace/api-server dev &
api_pid=$!
PORT="$web_port" API_PROXY_TARGET="http://127.0.0.1:${api_port}" pnpm --filter @workspace/bismillah-textiles dev &
web_pid=$!

cleanup() {
  kill "$api_pid" "$web_pid" 2>/dev/null || true
  wait "$api_pid" "$web_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

wait -n "$api_pid" "$web_pid"
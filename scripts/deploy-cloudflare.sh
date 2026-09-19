#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

WORKER_NAME="${CLOUDFLARE_WORKER_NAME:-rough-unit-cf8b}"
COMPATIBILITY_DATE="${CLOUDFLARE_COMPATIBILITY_DATE:-2026-09-15}"
ASSUME_YES="${ASSUME_YES:-0}"
DRY_RUN_ONLY=0

info() { printf '\033[1;34m[spanaz]\033[0m %s\n' "$*"; }
ok() { printf '\033[1;32m[ok]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[warn]\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

usage() {
  cat <<'EOF'
Usage: bash scripts/deploy-cloudflare.sh [--dry-run] [--yes]

Builds SpaNaz locally and deploys it to the existing Cloudflare Worker.

Options:
  --dry-run   Build and validate the Wrangler upload without deploying.
  --yes, -y   Skip the final deployment confirmation.

Environment overrides:
  CLOUDFLARE_WORKER_NAME         Worker name (default: rough-unit-cf8b)
  CLOUDFLARE_COMPATIBILITY_DATE  Wrangler compatibility date
  ASSUME_YES=1                   Same as --yes
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN_ONLY=1
      ;;
    --yes|-y)
      ASSUME_YES=1
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      usage >&2
      die "Unknown argument: $1"
      ;;
  esac
  shift
done

command -v node >/dev/null 2>&1 || die "Node.js is required."
command -v npm >/dev/null 2>&1 || die "npm is required."
command -v npx >/dev/null 2>&1 || die "npx is required."

[[ -f package.json ]] || die "package.json was not found. Run this script from the SpaNaz repository."

if [[ -f .env.local ]]; then
  grep -q '^VITE_FIREBASE_PROJECT_ID=' .env.local || \
    die "VITE_FIREBASE_PROJECT_ID is missing from .env.local."
  grep -q '^VITE_FIREBASE_API_KEY=' .env.local || \
    die "VITE_FIREBASE_API_KEY is missing from .env.local."
  ok "Local Firebase fallback configuration found."
else
  warn ".env.local is absent. The production build will rely on Cloudflare Worker runtime variables."
fi

WRANGLER=(npx --yes wrangler@latest)

info "Checking Cloudflare authentication..."
"${WRANGLER[@]}" whoami >/dev/null
ok "Cloudflare authentication is available."

info "Verifying existing production Worker: $WORKER_NAME"
if ! "${WRANGLER[@]}" deployments list --name "$WORKER_NAME" >/dev/null 2>&1; then
  die "Worker '$WORKER_NAME' could not be found. Refusing to create a different production Worker."
fi
ok "Existing Worker confirmed: $WORKER_NAME"

info "Cleaning previous build output..."
rm -rf dist .output

info "Building SpaNaz with the Firebase values from .env.local..."
npm run build
ok "Production build completed."

MAIN_ENTRY=""
ASSETS_DIR=""

# Lovable/TanStack/Nitro builds can use slightly different output layouts.
# Detect the generated Worker entry instead of assuming one layout.
if [[ -f .output/server/index.mjs && -d dist/client ]]; then
  MAIN_ENTRY=".output/server/index.mjs"
  ASSETS_DIR="dist/client"
elif [[ -f .output/server/index.mjs && -d .output/public ]]; then
  MAIN_ENTRY=".output/server/index.mjs"
  ASSETS_DIR=".output/public"
elif [[ -f dist/server/index.mjs && -d dist/client ]]; then
  MAIN_ENTRY="dist/server/index.mjs"
  ASSETS_DIR="dist/client"
elif [[ -f dist/server/index.js && -d dist/client ]]; then
  MAIN_ENTRY="dist/server/index.js"
  ASSETS_DIR="dist/client"
fi

if [[ -z "$MAIN_ENTRY" || -z "$ASSETS_DIR" ]]; then
  warn "Could not recognize the Cloudflare build layout."
  printf '\nGenerated server candidates:\n'
  find .output dist -maxdepth 4 -type f \( -name 'index.mjs' -o -name 'index.js' \) -print 2>/dev/null || true
  printf '\nGenerated asset directories:\n'
  find .output dist -maxdepth 3 -type d \( -name client -o -name public \) -print 2>/dev/null || true
  die "No supported Worker bundle was found. Nothing was deployed."
fi

ok "Worker entry: $MAIN_ENTRY"
ok "Static assets: $ASSETS_DIR"

TEMP_CONFIG=".wrangler.deploy.$$.jsonc"
cleanup() {
  rm -f "$TEMP_CONFIG"
}
trap cleanup EXIT

cat > "$TEMP_CONFIG" <<EOF
{
  "\$schema": "./node_modules/wrangler/config-schema.json",
  "name": "$WORKER_NAME",
  "main": "./$MAIN_ENTRY",
  "compatibility_date": "$COMPATIBILITY_DATE",
  "compatibility_flags": ["nodejs_compat"],
  "keep_vars": true,
  "assets": {
    "directory": "./$ASSETS_DIR",
    "binding": "ASSETS"
  },
  "observability": {
    "enabled": true
  }
}
EOF

info "Running Wrangler dry-run for $WORKER_NAME..."
"${WRANGLER[@]}" deploy --config "$TEMP_CONFIG" --dry-run
ok "Wrangler dry-run passed."

if [[ "$DRY_RUN_ONLY" == "1" ]]; then
  ok "Dry-run requested; production was not changed."
  exit 0
fi

if [[ "$ASSUME_YES" != "1" ]]; then
  printf '\nThis will update the existing production Worker: %s\n' "$WORKER_NAME"
  read -r -p "Deploy SpaNaz to production now? [y/N] " answer
  [[ "$answer" =~ ^[Yy]$ ]] || die "Deployment cancelled."
fi

info "Deploying SpaNaz to Cloudflare Worker: $WORKER_NAME"
"${WRANGLER[@]}" deploy --config "$TEMP_CONFIG"
ok "Cloudflare deployment completed."

printf '\nLatest deployment:\n'
"${WRANGLER[@]}" deployments list --name "$WORKER_NAME" | head -n 18 || true
printf '\nProduction URL: https://spanaz.ro/\n'

if command -v curl >/dev/null 2>&1; then
  printf '\nProduction health check:\n'
  HEALTH_URL="https://spanaz.ro/api/health"
  HEALTH_BODY="$(curl -fsS "$HEALTH_URL" 2>/dev/null || true)"
  if [[ "$HEALTH_BODY" == *'"firebaseConfigured":true'* ]]; then
    ok "Production Worker sees the Firebase runtime configuration."
    printf '%s\n' "$HEALTH_BODY"
  else
    warn "Production health check did not confirm Firebase configuration."
    printf '%s\n' "${HEALTH_BODY:-No response from $HEALTH_URL}"
    printf '\nCheck Cloudflare Worker -> Settings -> Variables and Secrets and confirm these runtime variables exist:\n'
    printf '  VITE_FIREBASE_PROJECT_ID\n'
    printf '  VITE_FIREBASE_API_KEY\n'
    printf 'Then deploy the variable changes in Cloudflare and rerun this deployment.\n'
  fi
fi

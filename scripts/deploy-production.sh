#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

info() { printf '\033[1;34m[spanaz]\033[0m %s\n' "$*"; }
ok() { printf '\033[1;32m[ok]\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

command -v node >/dev/null 2>&1 || die "Node.js is required."
command -v npm >/dev/null 2>&1 || die "npm is required."
command -v npx >/dev/null 2>&1 || die "npx is required."

[[ -f .env.local ]] || die ".env.local is required for production deployment."
PROJECT_ID="$(grep -E '^VITE_FIREBASE_PROJECT_ID=' .env.local | tail -n 1 | cut -d= -f2-)"
[[ -n "$PROJECT_ID" ]] || die "VITE_FIREBASE_PROJECT_ID is missing from .env.local."

info "Deploying Firestore security rules to $PROJECT_ID..."
npx --yes firebase-tools@latest deploy --only firestore:rules --project "$PROJECT_ID"
ok "Firestore rules deployed."

info "Deploying SPA NAZ website to Cloudflare..."
bash scripts/deploy-cloudflare.sh --yes
ok "Production deployment complete."

printf '\nSPA NAZ production: https://spanaz.ro/\n'
printf 'Review section: https://spanaz.ro/#recenzii\n'
printf 'Customer account: https://spanaz.ro/account\n'
printf 'Owner reviews: https://spanaz.ro/admin/reviews\n'

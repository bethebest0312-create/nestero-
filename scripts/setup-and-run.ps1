<#
PowerShell setup script for Windows. Run from repository root.
Usage: Open PowerShell and run: .\scripts\setup-and-run.ps1
#>

function Check-Command($name) {
  $which = Get-Command $name -ErrorAction SilentlyContinue
  return $which -ne $null
}

Write-Host "Starting local setup for Nestero..." -ForegroundColor Cyan

if (-not (Check-Command npm)) {
  Write-Error "npm not found. Install Node.js (18+) and ensure npm is on PATH. Aborting."
  exit 1
}

if (-not (Test-Path -Path ".env")) {
  Copy-Item -Path ".env.example" -Destination ".env" -Force
  Write-Host "Created .env from .env.example. Edit .env and add real values before running migrations if needed." -ForegroundColor Yellow
} else {
  Write-Host ".env already exists — leaving it in place." -ForegroundColor Green
}

Write-Host "Installing dependencies (npm ci)..." -ForegroundColor Cyan
npm ci
if ($LASTEXITCODE -ne 0) { Write-Error "npm ci failed"; exit $LASTEXITCODE }

Write-Host "Generating Prisma client (npx prisma generate)..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) { Write-Error "prisma generate failed"; exit $LASTEXITCODE }

Write-Host "Creating and applying migrations (npx prisma migrate dev --name init)..." -ForegroundColor Cyan
Write-Host "If you want to inspect SQL first, run: npx prisma migrate dev --create-only --name init" -ForegroundColor Yellow
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) { Write-Error "prisma migrate dev failed"; exit $LASTEXITCODE }

Write-Host "Running seed script (npm run seed)..." -ForegroundColor Cyan
npm run seed
if ($LASTEXITCODE -ne 0) { Write-Warning "Seed script failed (check DB/migrations). You can run it manually later." }

Write-Host "Typechecking (npm run typecheck)..." -ForegroundColor Cyan
npm run typecheck
if ($LASTEXITCODE -ne 0) { Write-Warning "Typecheck reported errors. Fix them or continue to run dev server." }

Write-Host "Starting dev server (npm run dev). Press Ctrl+C to stop." -ForegroundColor Cyan
npm run dev

Write-Host "Done." -ForegroundColor Green

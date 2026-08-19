<#
PowerShell script to open a GitHub PR using gh CLI with the prepared PR body.
Usage: .\scripts\create-pr.ps1
It requires 'gh' to be installed and authenticated.
#>

function Check-Command($name) {
  $which = Get-Command $name -ErrorAction SilentlyContinue
  return $which -ne $null
}

if (-not (Check-Command gh)) {
  Write-Error "gh CLI not found. Install GitHub CLI and authenticate (gh auth login). Aborting."
  exit 1
}

# get current branch
$branch = (git rev-parse --abbrev-ref HEAD).Trim()
if (-not $branch) { Write-Error "Failed to detect current git branch"; exit 1 }
$prTitle = "feat(foundation): project foundation, DB models, API stubs, UI polish"
$bodyFile = "docs/PR_DESCRIPTION.md"

Write-Host "Creating PR from branch $branch..." -ForegroundColor Cyan
# default base branch
$base = 'main'

gh pr create --base $base --head $branch --title $prTitle --body-file $bodyFile

if ($LASTEXITCODE -ne 0) { Write-Error "gh pr create failed"; exit $LASTEXITCODE }

Write-Host "PR created (or an interactive flow opened). Check gh output above." -ForegroundColor Green

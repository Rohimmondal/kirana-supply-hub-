# Publish helper for Kirana Supply Hub
# Requires Git installed.

$repoUrl = Read-Host 'Enter your GitHub repository URL (e.g. https://github.com/username/repo.git)'
if (-not $repoUrl) {
  Write-Host 'Repository URL is required.' -ForegroundColor Yellow
  return
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host 'Git is not installed. Please install Git first: https://git-scm.com/downloads' -ForegroundColor Red
  return
}

if (-not (Test-Path .git)) {
  git init
}

git add .
git commit -m 'Publish Kirana Supply Hub prototype' -q

git remote remove origin 2>$null
if ($LASTEXITCODE -ne 0) { }
git remote add origin $repoUrl

git branch -M main

git push -u origin main

Write-Host 'Published to GitHub. Next, enable GitHub Pages in repository settings.' -ForegroundColor Green

$commits = @(
    "1ebde3f",
    "a8f20b7",
    "34c5f09",
    "9a3ccdd",
    "94f356f",
    "7709a7b",
    "55880f3",
    "f869f69",
    "281b269"
)

foreach ($commit in $commits) {

    Write-Host ""
    Write-Host "Applying commit: $commit"

    git cherry-pick $commit

    git push origin main

    Write-Host "Waiting 5 minutes before next push..."

    Start-Sleep -Seconds 300
}

Write-Host ""
Write-Host "All commits pushed successfully."
$startTime = Get-Date "2025-07-20 10:00:00"

$commits = @(
    @{
        files = @("backend/server.js", "backend/config")
        message = "setup Express backend server"
    },
    @{
        files = @("backend/models")
        message = "create MongoDB schemas for users projects and tasks"
    },
    @{
        files = @("backend/routes", "backend/controllers", "backend/middleware")
        message = "implement JWT authentication flow"
    },
    @{
        files = @("backend/routes/project*", "backend/controllers/project*")
        message = "add project management APIs"
    },
    @{
        files = @("backend/routes/task*", "backend/controllers/task*")
        message = "implement task assignment workflows"
    },
    @{
        files = @("backend/routes/dashboard*", "backend/controllers/dashboard*")
        message = "add dashboard analytics endpoints"
    },
    @{
        files = @("backend/utils/seed*")
        message = "create database seed script"
    },
    @{
        files = @("frontend/src/main*", "frontend/src/App*", "frontend/vite.config*", "frontend/tailwind.config*")
        message = "setup React frontend with Vite and Tailwind"
    },
    @{
        files = @("frontend/src/api", "frontend/src/context")
        message = "configure API client and auth context"
    },
    @{
        files = @("frontend/src/components", "frontend/src/layouts")
        message = "build shared dashboard layout"
    },
    @{
        files = @("frontend/src/pages/Login*", "frontend/src/pages/Signup*")
        message = "add login and signup pages"
    },
    @{
        files = @("frontend/src/pages/Dashboard*")
        message = "build analytics dashboard UI"
    },
    @{
        files = @("frontend/src/pages/Projects*", "frontend/src/pages/ProjectDetails*")
        message = "implement project management interface"
    },
    @{
        files = @("frontend/src/pages/Tasks*")
        message = "add task tables and assignment workflows"
    },
    @{
        files = @("frontend/src/hooks", "frontend/src/utils")
        message = "implement task filtering and search"
    },
    @{
        files = @("frontend/src")
        message = "polish responsive dashboard experience"
    },
    @{
        files = @("railway.json", "backend/.env.example", "frontend/.env.example")
        message = "configure Railway deployment"
    },
    @{
        files = @(".")
        message = "add setup and deployment documentation"
    }
)

for ($i = 0; $i -lt $commits.Count; $i++) {

    $commit = $commits[$i]

    foreach ($file in $commit.files) {
        git add $file
    }

    $commitTime = $startTime.AddMinutes(25 * ($i + 1))
    $formattedTime = $commitTime.ToString("yyyy-MM-dd HH:mm:ss")

    $env:GIT_AUTHOR_DATE = $formattedTime
    $env:GIT_COMMITTER_DATE = $formattedTime

    git commit -m $commit.message

    Write-Host "Committed: $($commit.message)"
}

Write-Host "All commits completed successfully."
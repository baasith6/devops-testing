# PowerShell script to tag and push Docker images to Docker Hub
# Usage: .\push-image.ps1

$DOCKER_USERNAME = "baasith6"
$REPO_NAME = "linksnap"
$IMAGE_NAME = "linksnap:latest"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Docker Hub Push Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if local image exists
Write-Host "Checking local image..." -ForegroundColor Yellow
$imageExists = docker images -q $IMAGE_NAME
if (-not $imageExists) {
    Write-Host "✗ Local image '$IMAGE_NAME' not found. Please build it first." -ForegroundColor Red
    Write-Host "  Run: docker build -t $IMAGE_NAME ." -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Local image found" -ForegroundColor Green

# Tag images
Write-Host ""
Write-Host "Tagging images..." -ForegroundColor Yellow
docker tag $IMAGE_NAME "${DOCKER_USERNAME}/${REPO_NAME}:latest"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Tagged: ${DOCKER_USERNAME}/${REPO_NAME}:latest" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to tag latest" -ForegroundColor Red
    exit 1
}

docker tag $IMAGE_NAME "${DOCKER_USERNAME}/${REPO_NAME}:v1.0.0"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Tagged: ${DOCKER_USERNAME}/${REPO_NAME}:v1.0.0" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to tag v1.0.0" -ForegroundColor Red
    exit 1
}

# Check if logged in to Docker Hub
Write-Host ""
Write-Host "Checking Docker Hub login..." -ForegroundColor Yellow
$loginCheck = docker info 2>&1 | Select-String "Username"
if (-not $loginCheck) {
    Write-Host "⚠ Not logged in to Docker Hub" -ForegroundColor Yellow
    Write-Host "Please login first:" -ForegroundColor Yellow
    Write-Host "  docker login" -ForegroundColor Cyan
    Write-Host ""
    $login = Read-Host "Do you want to login now? (y/n)"
    if ($login -eq "y" -or $login -eq "Y") {
        docker login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "✗ Login failed" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Please login and run this script again." -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "✓ Already logged in to Docker Hub" -ForegroundColor Green
}

# Push images
Write-Host ""
Write-Host "Pushing images to Docker Hub..." -ForegroundColor Yellow
Write-Host "This may take a few minutes depending on your internet speed..." -ForegroundColor Gray

docker push "${DOCKER_USERNAME}/${REPO_NAME}:latest"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Pushed: ${DOCKER_USERNAME}/${REPO_NAME}:latest" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to push latest" -ForegroundColor Red
    exit 1
}

docker push "${DOCKER_USERNAME}/${REPO_NAME}:v1.0.0"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Pushed: ${DOCKER_USERNAME}/${REPO_NAME}:v1.0.0" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to push v1.0.0" -ForegroundColor Red
    exit 1
}

# Success message
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ Images pushed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Repository URL: https://hub.docker.com/r/${DOCKER_USERNAME}/${REPO_NAME}" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now pull the image with:" -ForegroundColor Yellow
Write-Host "  docker pull ${DOCKER_USERNAME}/${REPO_NAME}:latest" -ForegroundColor Cyan
Write-Host ""


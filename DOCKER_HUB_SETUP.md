# Docker Hub Setup Guide

## Repository Information

- **Docker Hub Username**: `baasith6`
- **Repository Name**: `linksnap`
- **Full Repository Path**: `baasith6/linksnap`
- **Repository URL**: https://hub.docker.com/r/baasith6/linksnap

## Tagged Images

The following images have been tagged and are ready to push:

1. **Latest**: `baasith6/linksnap:latest`
2. **Version**: `baasith6/linksnap:v1.0.0`

Both images point to the same build (Image ID: e51f5f4a46d3, Size: 221MB)

## Next Steps

### Step 1: Login to Docker Hub

```bash
docker login
```

You will be prompted for:
- **Username**: `baasith6`
- **Password**: Your Docker Hub password (or access token)

**Alternative (non-interactive)**:
```bash
docker login -u baasith6
```

### Step 2: Push Images to Docker Hub

Once logged in, push both tags:

```bash
# Push latest tag
docker push baasith6/linksnap:latest

# Push version tag
docker push baasith6/linksnap:v1.0.0
```

**Or push both at once**:
```bash
docker push baasith6/linksnap:latest
docker push baasith6/linksnap:v1.0.0
```

### Step 3: Verify on Docker Hub

1. Visit: https://hub.docker.com/r/baasith6/linksnap
2. Verify both tags appear in the repository
3. Check image details and size

### Step 4: Test Pulling (Optional but Recommended)

Test that the image can be pulled from Docker Hub:

```bash
# Remove local images first
docker rmi baasith6/linksnap:latest baasith6/linksnap:v1.0.0

# Pull from Docker Hub
docker pull baasith6/linksnap:latest

# Run the pulled image
docker run -p 3000:3000 baasith6/linksnap:latest
```

## Tagging Commands Reference

### Tag with Latest
```bash
docker tag linksnap:latest baasith6/linksnap:latest
```

### Tag with Version
```bash
docker tag linksnap:latest baasith6/linksnap:v1.0.0
```

### Tag with Commit Hash (for CI/CD)
```bash
COMMIT_HASH=$(git rev-parse --short HEAD)
docker tag linksnap:latest baasith6/linksnap:${COMMIT_HASH}
```

### Tag with Custom Tag
```bash
docker tag linksnap:latest baasith6/linksnap:dev
docker tag linksnap:latest baasith6/linksnap:staging
```

## Quick Push Script

Create a script to tag and push easily:

**For Windows (PowerShell)** - `push-image.ps1`:
```powershell
# Tag images
docker tag linksnap:latest baasith6/linksnap:latest
docker tag linksnap:latest baasith6/linksnap:v1.0.0

# Push images
docker push baasith6/linksnap:latest
docker push baasith6/linksnap:v1.0.0

Write-Host "Images pushed successfully!"
```

**For Linux/Mac (Bash)** - `push-image.sh`:
```bash
#!/bin/bash
# Tag images
docker tag linksnap:latest baasith6/linksnap:latest
docker tag linksnap:latest baasith6/linksnap:v1.0.0

# Push images
docker push baasith6/linksnap:latest
docker push baasith6/linksnap:v1.0.0

echo "Images pushed successfully!"
```

## Using the Image

### Pull and Run
```bash
docker pull baasith6/linksnap:latest
docker run -p 3000:3000 baasith6/linksnap:latest
```

### With Environment Variables
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BASE_URL=https://yourdomain.com \
  baasith6/linksnap:latest
```

### In Docker Compose
```yaml
version: '3.8'
services:
  linksnap:
    image: baasith6/linksnap:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Troubleshooting

### Authentication Failed
- Verify username and password are correct
- Use access token instead of password for better security
- Check if 2FA is enabled (requires access token)

### Push Denied
- Ensure repository exists on Docker Hub
- Check repository visibility (public/private)
- Verify you have push permissions

### Network Issues
- Check internet connection
- Verify Docker Hub is accessible
- Try again after a few minutes

## Security Best Practices

1. **Use Access Tokens**: Instead of passwords, use Docker Hub access tokens
   - Go to: https://hub.docker.com/settings/security
   - Create new access token
   - Use token as password when logging in

2. **Private Repositories**: For sensitive projects, use private repositories

3. **Tag Strategy**: Use semantic versioning and commit hashes for traceability

## Current Status

✅ **Images Tagged**: 
- `baasith6/linksnap:latest`
- `baasith6/linksnap:v1.0.0`

⏳ **Next Action**: Login and push to Docker Hub

---

**Repository URL**: https://hub.docker.com/r/baasith6/linksnap


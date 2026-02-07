# Jenkins CI Pipeline Setup Guide

## ✅ Completed Steps

1. ✅ Jenkins installed and running on port 8080
2. ✅ Required plugins installed (Pipeline, Git, Docker)
3. ✅ Docker Hub credentials configured
   - Username: `baasith6`
   - Credentials ID: `docker-hub-credentials`
   - Type: Username with password (access token)

## 📋 Next Steps: Create Pipeline Job

### Step 1: Create New Pipeline Job

1. **Open Jenkins Dashboard**
   - Go to: `http://localhost:8080`

2. **Create New Item**
   - Click: **"New Item"** (on the left sidebar)
   - Enter name: `linksnap-ci-pipeline`
   - Select: **"Pipeline"**
   - Click: **"OK"**

### Step 2: Configure Pipeline

1. **General Settings**
   - **Description**: `CI Pipeline for LinkSnap - Automatically builds and pushes Docker images to Docker Hub`

2. **Pipeline Configuration**
   - **Definition**: Select **"Pipeline script from SCM"**
   - **SCM**: Select **"Git"**
   - **Repository URL**: 
     - If using GitHub/GitLab: Enter your repository URL
     - Example: `https://github.com/yourusername/linksnap.git`
     - If local repository: Use file path (e.g., `file:///F:/tic/devops project`)
   - **Credentials**: (Leave empty if public repo, or select if private)
   - **Branch Specifier**: `*/main` or `*/master` (depending on your default branch)
   - **Script Path**: `Jenkinsfile` (should already be set)

3. **Build Triggers** (Optional but Recommended)
   - **Poll SCM**: Check this box
   - **Schedule**: Enter `H/5 * * * *` (checks every 5 minutes)
     - Or `H * * * *` (checks every hour)
     - Or `*/15 * * * *` (checks every 15 minutes)

4. **Advanced Options** (Optional)
   - **Lightweight checkout**: Uncheck if you need full Git history

5. **Click**: **"Save"**

### Step 3: Test the Pipeline

1. **Run First Build**
   - Click: **"Build Now"** (on the left sidebar)
   - You'll see a build appear in the "Build History"

2. **Monitor Build Progress**
   - Click on the build number (e.g., "#1")
   - Click: **"Console Output"** to see real-time logs

3. **Verify Success**
   - Check that all stages complete:
     - ✅ Checkout
     - ✅ Build Docker Image
     - ✅ Tag Image
     - ✅ Login to Docker Hub
     - ✅ Push to Docker Hub
   - Check Docker Hub: https://hub.docker.com/r/baasith6/linksnap
   - Verify new tags appear (latest, v1.0.X, commit hash)

## 🔧 Troubleshooting

### Issue: "Docker command not found"
**Solution**: 
- Ensure Docker is installed on Jenkins server
- Add Jenkins user to docker group (Linux):
  ```bash
  sudo usermod -aG docker jenkins
  sudo systemctl restart jenkins
  ```

### Issue: "Credentials not found"
**Solution**:
- Verify credentials ID matches: `docker-hub-credentials`
- Go to: Manage Jenkins → Credentials
- Check the ID field matches exactly

### Issue: "Git checkout failed"
**Solution**:
- Verify repository URL is correct
- Check if repository is accessible
- For local repos, ensure Jenkins has file system access

### Issue: "Docker login failed"
**Solution**:
- Verify Docker Hub credentials are correct
- Check if access token is valid
- Ensure network connectivity to Docker Hub

### Issue: "Permission denied"
**Solution**:
- Check Docker permissions for Jenkins user
- Verify Docker daemon is running
- Check file permissions for project directory

## 📊 Pipeline Stages Overview

1. **Checkout**: Pulls code from Git repository
2. **Build**: Builds Docker image using Dockerfile
3. **Tag**: Tags image with version and commit hash
4. **Login**: Authenticates with Docker Hub
5. **Push**: Pushes all tags to Docker Hub

## 🎯 Expected Output

After successful build, you should see:
- Docker image built: `baasith6/linksnap:latest`
- Tags created:
  - `baasith6/linksnap:latest`
  - `baasith6/linksnap:v1.0.1` (build number)
  - `baasith6/linksnap:abc123` (commit hash)
- All tags pushed to Docker Hub

## 🔄 Automatic Builds

The pipeline will automatically trigger when:
- **Poll SCM** is enabled (checks repository periodically)
- **Webhook** is configured (triggers on Git push)

### Setting up Webhook (GitHub)

1. Go to your GitHub repository
2. Settings → Webhooks → Add webhook
3. Payload URL: `http://your-jenkins-url:8080/github-webhook/`
4. Content type: `application/json`
5. Events: Just the `push` event
6. Save

## 📝 Jenkinsfile Location

The `Jenkinsfile` is located in your project root:
- Path: `F:\tic\devops project\Jenkinsfile`
- This file defines the entire CI pipeline

## 🔐 Security Notes

- Docker Hub credentials are stored securely in Jenkins
- Access tokens are recommended over passwords
- Credentials are never exposed in logs

## ✅ Validation Checklist

Before moving to Phase 5, ensure:
- [ ] Pipeline job created successfully
- [ ] First build completed successfully
- [ ] Docker image built correctly
- [ ] Image tagged with version and commit hash
- [ ] Image pushed to Docker Hub
- [ ] Tags visible on Docker Hub
- [ ] Automatic builds working (polling or webhook)

## 🚀 Next Phase

Once Phase 4 is complete, proceed to:
**Phase 5: Infrastructure as Code (Terraform)**
- Set up AWS infrastructure
- Create EKS cluster
- Configure networking

---

**Current Status**: ✅ Jenkinsfile created, ready to configure pipeline job


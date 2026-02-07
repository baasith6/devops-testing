# Docker Guide for LinkSnap

This guide explains how to build, run, and deploy LinkSnap using Docker.

## Prerequisites

- Docker installed on your system
- Docker Desktop (for Windows/Mac) or Docker Engine (for Linux)

## Quick Start

### 1. Build the Docker Image

```bash
docker build -t linksnap:latest .
```

Or with a specific tag:

```bash
docker build -t linksnap:v1.0.0 .
```

### 2. Run the Container

#### Basic Run (using default environment)
```bash
docker run -p 3000:3000 linksnap:latest
```

#### With Environment Variables
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BASE_URL=http://localhost:3000 \
  linksnap:latest
```

#### With Environment File
```bash
docker run -p 3000:3000 --env-file .env.example linksnap:latest
```

#### Run in Background (Detached Mode)
```bash
docker run -d -p 3000:3000 --name linksnap linksnap:latest
```

### 3. Access the Application

Once the container is running, access the application at:
- **Local**: http://localhost:3000
- **Network**: http://<your-ip>:3000

## Docker Commands Reference

### View Running Containers
```bash
docker ps
```

### View All Containers (including stopped)
```bash
docker ps -a
```

### View Container Logs
```bash
docker logs linksnap
```

Or with follow mode (real-time):
```bash
docker logs -f linksnap
```

### Stop Container
```bash
docker stop linksnap
```

### Start Stopped Container
```bash
docker start linksnap
```

### Remove Container
```bash
docker rm linksnap
```

### Remove Image
```bash
docker rmi linksnap:latest
```

### Execute Commands in Running Container
```bash
docker exec -it linksnap sh
```

## Environment Variables

### Required Variables
- `NEXT_PUBLIC_BASE_URL` - Base URL for your application
  - Development: `http://localhost:3000`
  - Production: `https://yourdomain.com`

### Optional Variables
- `PORT` - Port to run the application (default: 3000)
- `NODE_ENV` - Node environment (default: production)

### Setting Environment Variables

#### Method 1: Using -e flag
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BASE_URL=https://linksnap.com \
  linksnap:latest
```

#### Method 2: Using --env-file
```bash
docker run -p 3000:3000 --env-file .env.production linksnap:latest
```

#### Method 3: Using docker-compose (see below)

## Docker Compose (Optional)

Create a `docker-compose.yml` file for easier management:

```yaml
version: '3.8'

services:
  linksnap:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BASE_URL=http://localhost:3000
    restart: unless-stopped
    container_name: linksnap
```

Run with:
```bash
docker-compose up -d
```

Stop with:
```bash
docker-compose down
```

## Image Optimization

The Dockerfile uses multi-stage builds to optimize image size:

1. **deps stage**: Installs dependencies
2. **builder stage**: Builds the Next.js application
3. **runner stage**: Creates minimal production image

### Image Size
- Expected size: ~150-200MB (Alpine-based)
- Full image with all dependencies: ~500MB+

## Security Best Practices

✅ **Implemented:**
- Runs as non-root user (nextjs:nodejs)
- Uses Alpine Linux (minimal attack surface)
- Multi-stage build (reduces final image size)
- Only production dependencies in final image

## Troubleshooting

### Container Exits Immediately
- Check logs: `docker logs linksnap`
- Verify port 3000 is not already in use
- Check environment variables are set correctly

### Application Not Accessible
- Verify port mapping: `-p 3000:3000`
- Check firewall settings
- Verify container is running: `docker ps`

### Build Fails
- Ensure all files are present (check .dockerignore)
- Verify Node.js version compatibility
- Check for syntax errors in Dockerfile

### Permission Errors
- Container runs as non-root user
- If issues occur, check file permissions

## Production Deployment

### Tagging for Production
```bash
docker build -t linksnap:production .
docker tag linksnap:production your-registry/linksnap:v1.0.0
```

### Pushing to Registry
```bash
docker push your-registry/linksnap:v1.0.0
```

## Next Steps

After Docker is working locally:
- **Phase 3**: Push image to Docker Hub
- **Phase 4**: Set up CI/CD pipeline
- **Phase 6**: Deploy to Kubernetes

## Support

For issues or questions:
1. Check container logs: `docker logs linksnap`
2. Verify environment variables
3. Review Docker documentation


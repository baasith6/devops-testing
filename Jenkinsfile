pipeline {
    agent any
    
    environment {
        DOCKER_HUB_USERNAME = 'baasith6'
        DOCKER_HUB_REPO = 'linksnap'
        IMAGE_NAME = "${DOCKER_HUB_USERNAME}/${DOCKER_HUB_REPO}"
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out code from repository...'
                checkout scm
                bat 'git --version'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🔨 Building Docker image...'
                script {
                    bat """
                        docker build -t ${IMAGE_NAME}:latest .
                    """
                    echo "✅ Docker image built successfully: ${IMAGE_NAME}:latest"
                }
            }
        }
        
        stage('Tag Image') {
            steps {
                echo '🏷️  Tagging Docker image...'
                script {
                    // Get commit hash - write to file and read it (Windows compatible)
                    bat """
                        git rev-parse --short HEAD > commit_hash.txt
                    """
                    def commitHash = readFile('commit_hash.txt').trim()
                    def version = "v1.0.${env.BUILD_NUMBER}"
                    
                    bat """
                        docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${version}
                        docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${commitHash}
                    """
                    
                    echo "✅ Tagged as:"
                    echo "   - ${version}"
                    echo "   - ${commitHash}"
                }
            }
        }
        
        stage('Login to Docker Hub') {
            steps {
                echo '🔐 Logging in to Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKER_CREDENTIALS_ID}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat """
                        docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                    """
                    echo "✅ Successfully logged in to Docker Hub"
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                echo '📤 Pushing image to Docker Hub...'
                script {
                    // Get commit hash from file (already created in Tag stage)
                    def commitHash = readFile('commit_hash.txt').trim()
                    def version = "v1.0.${env.BUILD_NUMBER}"
                    
                    bat """
                        docker push ${IMAGE_NAME}:latest
                        docker push ${IMAGE_NAME}:${version}
                        docker push ${IMAGE_NAME}:${commitHash}
                    """
                    
                    echo "✅ Successfully pushed:"
                    echo "   - ${IMAGE_NAME}:latest"
                    echo "   - ${IMAGE_NAME}:${version}"
                    echo "   - ${IMAGE_NAME}:${commitHash}"
                }
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline completed successfully!'
            echo "📦 Image available at: https://hub.docker.com/r/${IMAGE_NAME}"
            echo "🔗 Repository: https://hub.docker.com/r/${DOCKER_HUB_USERNAME}/${DOCKER_HUB_REPO}"
        }
        failure {
            echo '❌ Pipeline failed! Check the logs for details.'
            echo 'Common issues:'
            echo '  - Docker not running on Jenkins server'
            echo '  - Docker Hub credentials incorrect'
            echo '  - Network connectivity issues'
        }
        always {
            echo '🧹 Cleaning up...'
            // Optional: Clean up old images (using bat for Windows)
            bat 'docker system prune -f' 
        }
    }
}

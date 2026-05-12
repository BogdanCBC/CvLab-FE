pipeline {
    agent any

    environment {
        REGISTRY = 'ghcr.io'
        IMAGE_NAME = 'ghcr.io/bogdancbc/cvlab-fe'
        DEPLOY_HOST = '178.105.101.11'
        DEPLOY_USER = 'ubuntu2'
        DEPLOY_PATH = '/home/ubuntu2/Desktop/project-root'
        REACT_APP_BASE_URL = 'https://cvdev.feel-it-services.com'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/BogdanCBC/CvLab-FE.git',
                    credentialsId: 'github-token'
            }
        }

        stage('Build Image') {
            steps {
                script {
                    def commitHash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.COMMIT_HASH = commitHash
                    sh """
                        docker build \
                            --build-arg REACT_APP_BASE_URL=${REACT_APP_BASE_URL} \
                            -t ${IMAGE_NAME}:${commitHash} \
                            -t ${IMAGE_NAME}:latest .
                    """
                }
            }
        }

        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
                    sh """
                        echo \$GH_TOKEN | docker login ${REGISTRY} -u \$GH_USER --password-stdin
                        docker push ${IMAGE_NAME}:${COMMIT_HASH}
                        docker push ${IMAGE_NAME}:latest
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'hetzner-ssh', usernameVariable: 'SSH_USER', passwordVariable: 'SSH_PASS')
                ]) {
                    sh """
                        sshpass -p \$SSH_PASS ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} << 'ENDSSH'
                            cd ${DEPLOY_PATH}
                            docker compose pull frontend
                            docker compose up -d --force-recreate --no-deps frontend
                            docker image prune -f
ENDSSH
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Frontend deployed successfully! Image: ${IMAGE_NAME}:${COMMIT_HASH}"
        }
        failure {
            echo "Frontend pipeline failed!"
        }
        always {
            sh "docker rmi ${IMAGE_NAME}:${COMMIT_HASH} || true"
            sh "docker rmi ${IMAGE_NAME}:latest || true"
        }
    }
}

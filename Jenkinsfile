
@Library('jenkins-shared-lib') _

pipeline {
    agent any
    environment {
        FRONTEND_IMAGE = "anishkumar001/amazon-frontend"
        BACKEND_IMAGE  = "anishkumar001/amazon-backend"
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
    }
    stages {
        stage('Checkout') { steps { checkout scm } }
        stage('Semgrep Code Scan') { steps { semgrepScan() } }
        stage('Build Frontend Image') {
            steps { buildDocker(context:'app/frontend', image: FRONTEND_IMAGE, tag: IMAGE_TAG) }
        }
        stage('Build Backend Image') {
            steps { buildDocker(context:'app/backend', image: BACKEND_IMAGE, tag: IMAGE_TAG) }
        }
        stage('Trivy Scan Frontend') { steps { trivyScan("${FRONTEND_IMAGE}:${IMAGE_TAG}") } }
        stage('Trivy Scan Backend') { steps { trivyScan("${BACKEND_IMAGE}:${IMAGE_TAG}") } }
        stage('Gitleaks') { steps { gitleaksScan() } }
        stage('Push Images') {
            steps {
                withCredentials([usernamePassword(credentialsId:'dockerhub-creds',usernameVariable:'U',passwordVariable:'P')]){
                    sh 'echo $P | docker login -u $U --password-stdin'
                    sh "docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                    sh "docker push ${BACKEND_IMAGE}:${IMAGE_TAG}"
                }
            }
        }
        stage('Update Manifests') {
            steps {
                updateK8sManifest(manifest_paths:['k8s/frontend-deployment.yaml','k8s/backend-deployment.yaml'], image: BACKEND_IMAGE, tag: IMAGE_TAG)
            }
        }
    }
}

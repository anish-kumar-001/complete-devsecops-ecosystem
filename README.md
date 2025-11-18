🚀 Complete DevSecOps CI/CD Pipeline with Jenkins, Docker, ArgoCD & Kubernetes

Developed by: Anish Kumar

This project is a full DevSecOps implementation demonstrating CI, CD, container security, GitOps deployment, and Kubernetes orchestration on AWS EC2 & local Docker.

🎯 Project Goal

To build a fully automated CI/CD DevSecOps pipeline for a real microservices application using GitHub → Jenkins CI → DockerHub → GitHub → ArgoCD → Kubernetes (Minikube).

🧩 Architecture Overview (Table Format)
| Layer                  | Tool/Service                     | Purpose                                                              |
| ---------------------- | -------------------------------- | -------------------------------------------------------------------- |
| **Source Code**        | GitHub (Main Repo)               | Stores application code + Kubernetes manifests                       |
| **Shared Libraries**   | GitHub (Jenkins Shared Lib Repo) | Stores reusable Jenkins pipeline functions                           |
| **CI Engine**          | Jenkins (Docker Container)       | Pulls code, scans, builds images, pushes to DockerHub & updates YAML |
| **Security Tools**     | Trivy, Semgrep, Gitleaks         | Run inside Jenkins container for DevSecOps scanning                  |
| **Container Registry** | DockerHub                        | Stores built backend & frontend images                               |
| **GitOps Engine**      | ArgoCD                           | Watches GitHub repo & auto-deploys changes                           |
| **Orchestrator**       | Minikube (inside EC2 Docker)     | Runs Kubernetes cluster used for deployment                          |
| **Cloud Host**         | AWS EC2 (Ubuntu)                 | Hosts all CD components                                              |


🛠 Technologies Used

CI Layer= Jenkins,Jenkins Shared Library, Docker Desktop, DockerHub, Security Scans= Semgrep, Trivy, Gitleaks
CD Layer= ArgoCD (GitOps), Minikube, Kubernetes, Docker (EC2), Cloud, AWS EC2 Ubuntu Server

🏗 CI Pipeline Setup (Runs Locally on Docker Desktop)

This entire CI pipeline runs inside a Jenkins Docker container.

🔧 1. Install Docker Desktop

Download and install from:
https://www.docker.com/products/docker-desktop/

🐳 2. Start Jenkins in Docker
docker run -d \
  --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts


Access Jenkins at:

http://localhost:8080

🔌 3. Install Required Tools inside Jenkins container

Enter Jenkins container:

docker exec -it jenkins bash

Install Docker CLI
apt update
apt install docker.io -y

Install Trivy
apt-get install wget apt-transport-https gnupg -y
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | apt-key add -
echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | tee /etc/apt/sources.list.d/trivy.list
apt update
apt install trivy -y

Install Gitleaks
wget https://github.com/gitleaks/gitleaks/releases/latest/download/gitleaks-linux-amd64
mv gitleaks-linux-amd64 /usr/local/bin/gitleaks
chmod +x /usr/local/bin/gitleaks

Install Semgrep
pip install semgrep

🔗 4. Connect Jenkins CI to Your GitHub Repo

Inside Jenkins:

Create New Pipeline Job

Set SCM → Git → Main project repo

Add Jenkins Shared Library:

Manage Jenkins → Configure System → Global Pipeline Libraries

Name: devsecops-shared-lib

Repo URL: Your shared library repo

Add GitHub credentials (PAT)

Now Jenkins can pull:

Main Project Repo

Shared Library Repo

⚙ 5. What the CI Pipeline Does (High Level)

🔥 Jenkins automatically performs:

Pull latest code from GitHub

Pull shared library repo

Run Semgrep code scan

Build frontend Docker image

Build backend Docker image

Run Trivy vulnerability scans

Run Gitleaks secret scan

Push images to DockerHub

Update Kubernetes YAML image tags

Commit updates back to GitHub

Send email notification

🚀 CD Pipeline Setup (Runs on AWS EC2)

This part runs entirely on EC2 using Docker + Minikube + ArgoCD.

🔧 1. Install Docker on EC2
sudo apt update
sudo apt install docker.io -y
sudo usermod -aG docker $USER


Re-login.

🚀 2. Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube


Start:

minikube start --driver=docker --cpus=2 --memory=2500mb

✨ 3. Install kubectl
sudo snap install kubectl --classic

🎯 4. Install & Expose ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml


Expose UI:

kubectl patch svc argocd-server -n argocd -p '{"spec":{"type":"NodePort"}}'

🌐 Access ArgoCD UI
http://<EC2-Public-IP>:<NodePort>

🔗 Connect ArgoCD to GitHub Repo (GitOps)

Inside ArgoCD:

Click New App

Repo URL → your main GitHub repo

Path → /k8s

Cluster → in-cluster

Enable:

Auto-sync

Self-heal

Now ArgoCD

✔ Watches your repo
✔ Pulls changes when Jenkins updates YAML
✔ Automatically deploys to Minikube


🔁 End-to-End Workflow Summary
Developer → GitHub → Jenkins → Scans → Build → DockerHub → Update YAML → GitHub
→ ArgoCD → Auto Sync → Deploy to Minikube (EC2)
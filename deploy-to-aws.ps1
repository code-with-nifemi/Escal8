# AWS Deployment Script for Escal8 (PowerShell)
# Account ID: 550861864348

$ErrorActionPreference = "Stop"

# Configuration
$AWS_ACCOUNT_ID = "550861864348"
$AWS_REGION = "us-east-1"  # Change this to your preferred region
$ECR_BACKEND_REPO = "escal8-backend"
$ECR_FRONTEND_REPO = "escal8-frontend"
$ECS_CLUSTER = "escal8-cluster"

Write-Host "=== Escal8 AWS Deployment ===" -ForegroundColor Green
Write-Host "Account ID: $AWS_ACCOUNT_ID"
Write-Host "Region: $AWS_REGION"
Write-Host ""

# Step 1: Create ECR Repositories
Write-Host "Step 1: Creating ECR repositories..." -ForegroundColor Yellow
try {
    aws ecr describe-repositories --repository-names $ECR_BACKEND_REPO --region $AWS_REGION 2>$null
}
catch {
    aws ecr create-repository --repository-name $ECR_BACKEND_REPO --region $AWS_REGION
}

try {
    aws ecr describe-repositories --repository-names $ECR_FRONTEND_REPO --region $AWS_REGION 2>$null
}
catch {
    aws ecr create-repository --repository-name $ECR_FRONTEND_REPO --region $AWS_REGION
}

Write-Host "ECR repositories created successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Login to ECR
Write-Host "Step 2: Logging in to ECR..." -ForegroundColor Yellow
$loginPassword = aws ecr get-login-password --region $AWS_REGION
$loginPassword | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
Write-Host "Logged in to ECR successfully!" -ForegroundColor Green
Write-Host ""

# Step 3: Build and Push Backend Image
Write-Host "Step 3: Building and pushing backend image..." -ForegroundColor Yellow
Set-Location backend
docker build -t $ECR_BACKEND_REPO`:latest .
docker tag "$ECR_BACKEND_REPO`:latest" "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO`:latest"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO`:latest"
Set-Location ..
Write-Host "Backend image pushed successfully!" -ForegroundColor Green
Write-Host ""

# Step 4: Build and Push Frontend Image
Write-Host "Step 4: Building and pushing frontend image..." -ForegroundColor Yellow
Set-Location Escal8
docker build -t $ECR_FRONTEND_REPO`:latest .
docker tag "$ECR_FRONTEND_REPO`:latest" "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO`:latest"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO`:latest"
Set-Location ..
Write-Host "Frontend image pushed successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "=== Docker images pushed to ECR successfully! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Backend Image: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO`:latest"
Write-Host "Frontend Image: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO`:latest"
Write-Host ""

# Step 5: Deploy CloudFormation Stack
Write-Host "Step 5: Deploying CloudFormation stack..." -ForegroundColor Yellow
$STACK_NAME = "escal8-production"

try {
    aws cloudformation describe-stacks --stack-name $STACK_NAME --region $AWS_REGION 2>$null
    Write-Host "Stack already exists. Updating..." -ForegroundColor Yellow
    aws cloudformation update-stack `
        --stack-name $STACK_NAME `
        --template-body file://aws/cloudformation-template.yaml `
        --capabilities CAPABILITY_IAM `
        --region $AWS_REGION
    
    Write-Host "Waiting for stack update to complete..." -ForegroundColor Yellow
    aws cloudformation wait stack-update-complete --stack-name $STACK_NAME --region $AWS_REGION
}
catch {
    Write-Host "Creating new stack..." -ForegroundColor Yellow
    aws cloudformation create-stack `
        --stack-name $STACK_NAME `
        --template-body file://aws/cloudformation-template.yaml `
        --capabilities CAPABILITY_IAM `
        --region $AWS_REGION
    
    Write-Host "Waiting for stack creation to complete (this may take 5-10 minutes)..." -ForegroundColor Yellow
    aws cloudformation wait stack-create-complete --stack-name $STACK_NAME --region $AWS_REGION
}

Write-Host ""
Write-Host "=== Deployment Complete! ===" -ForegroundColor Green
Write-Host ""

# Get the Load Balancer URL
$ALB_URL = aws cloudformation describe-stacks `
    --stack-name $STACK_NAME `
    --region $AWS_REGION `
    --query "Stacks[0].Outputs[?OutputKey=='LoadBalancerURL'].OutputValue" `
    --output text

Write-Host "Your application is available at:" -ForegroundColor Cyan
Write-Host $ALB_URL -ForegroundColor Green
Write-Host ""
Write-Host "Note: It may take a few minutes for the services to become healthy." -ForegroundColor Yellow

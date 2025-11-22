#!/bin/bash

# AWS Deployment Script for Escal8
# Account ID: 177099687548

set -e

# Configuration
AWS_ACCOUNT_ID="177099687548"
AWS_REGION="us-east-1"  # Change this to your preferred region
ECR_BACKEND_REPO="escal8-backend"
ECR_FRONTEND_REPO="escal8-frontend"
ECS_CLUSTER="escal8-cluster"
BACKEND_SERVICE="escal8-backend-service"
FRONTEND_SERVICE="escal8-frontend-service"

echo "=== Escal8 AWS Deployment ==="
echo "Account ID: $AWS_ACCOUNT_ID"
echo "Region: $AWS_REGION"
echo ""

# Step 1: Create ECR Repositories
echo "Step 1: Creating ECR repositories..."
aws ecr describe-repositories --repository-names $ECR_BACKEND_REPO --region $AWS_REGION 2>/dev/null || \
  aws ecr create-repository --repository-name $ECR_BACKEND_REPO --region $AWS_REGION

aws ecr describe-repositories --repository-names $ECR_FRONTEND_REPO --region $AWS_REGION 2>/dev/null || \
  aws ecr create-repository --repository-name $ECR_FRONTEND_REPO --region $AWS_REGION

echo "ECR repositories created successfully!"
echo ""

# Step 2: Login to ECR
echo "Step 2: Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
echo "Logged in to ECR successfully!"
echo ""

# Step 3: Build and Push Backend Image
echo "Step 3: Building and pushing backend image..."
cd backend
docker build -t $ECR_BACKEND_REPO:latest .
docker tag $ECR_BACKEND_REPO:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:latest
cd ..
echo "Backend image pushed successfully!"
echo ""

# Step 4: Build and Push Frontend Image
echo "Step 4: Building and pushing frontend image..."
cd Escal8
docker build -t $ECR_FRONTEND_REPO:latest .
docker tag $ECR_FRONTEND_REPO:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:latest
cd ..
echo "Frontend image pushed successfully!"
echo ""

echo "=== Docker images pushed to ECR successfully! ==="
echo ""
echo "Backend Image: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:latest"
echo "Frontend Image: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:latest"
echo ""
echo "Next steps:"
echo "1. Deploy the CloudFormation stack: aws cloudformation create-stack --stack-name escal8-infrastructure --template-body file://aws/cloudformation-template.yaml --capabilities CAPABILITY_IAM"
echo "2. Or use the ECS console to create services using these images"

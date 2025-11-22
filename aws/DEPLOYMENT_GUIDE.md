# Escal8 AWS Deployment Guide

## Account Information
- **AWS Account ID**: 177099687548
- **Default Region**: us-east-1 (change in scripts if needed)

## Prerequisites

1. **AWS CLI** installed and configured
   ```bash
   aws configure
   ```

2. **Docker** installed and running

3. **Environment Variables** ready:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `ELEVENLABS_API_KEY`

## Deployment Options

### Option 1: Quick Deploy with PowerShell (Recommended for Windows)

```powershell
# Run the deployment script
.\deploy-to-aws.ps1
```

### Option 2: Manual Step-by-Step Deployment

#### Step 1: Create ECR Repositories

```bash
# Create backend repository
aws ecr create-repository --repository-name escal8-backend --region us-east-1

# Create frontend repository
aws ecr create-repository --repository-name escal8-frontend --region us-east-1
```

#### Step 2: Build and Push Docker Images

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 177099687548.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
cd backend
docker build -t escal8-backend:latest .
docker tag escal8-backend:latest 177099687548.dkr.ecr.us-east-1.amazonaws.com/escal8-backend:latest
docker push 177099687548.dkr.ecr.us-east-1.amazonaws.com/escal8-backend:latest
cd ..

# Build and push frontend
cd Escal8
docker build -t escal8-frontend:latest .
docker tag escal8-frontend:latest 177099687548.dkr.ecr.us-east-1.amazonaws.com/escal8-frontend:latest
docker push 177099687548.dkr.ecr.us-east-1.amazonaws.com/escal8-frontend:latest
cd ..
```

#### Step 3: Deploy CloudFormation Stack

```bash
aws cloudformation create-stack \
  --stack-name escal8-production \
  --template-body file://aws/cloudformation-template.yaml \
  --parameters \
    ParameterKey=SupabaseURL,ParameterValue=YOUR_SUPABASE_URL \
    ParameterKey=SupabaseKey,ParameterValue=YOUR_SUPABASE_KEY \
    ParameterKey=ElevenLabsAPIKey,ParameterValue=YOUR_ELEVENLABS_KEY \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

#### Step 4: Monitor Deployment

```bash
# Check stack creation status
aws cloudformation describe-stacks --stack-name escal8-production --region us-east-1

# Get the load balancer URL
aws cloudformation describe-stacks --stack-name escal8-production --region us-east-1 --query "Stacks[0].Outputs[?OutputKey=='LoadBalancerURL'].OutputValue" --output text
```

### Option 3: Deploy via AWS Console

1. **ECR Setup**:
   - Go to ECR in AWS Console
   - Create repositories: `escal8-backend` and `escal8-frontend`
   - Push images using the commands from Step 2 above

2. **CloudFormation Stack**:
   - Go to CloudFormation in AWS Console
   - Click "Create Stack"
   - Upload `aws/cloudformation-template.yaml`
   - Fill in the parameters (Supabase URL, Keys, etc.)
   - Create the stack

## Infrastructure Components

The CloudFormation template creates:

- **VPC** with 2 public subnets across 2 availability zones
- **Application Load Balancer** for routing traffic
- **ECS Fargate Cluster** for running containers
- **2 ECS Services**:
  - Frontend (Next.js on port 3000)
  - Backend (FastAPI on port 8000)
- **Security Groups** for network isolation
- **CloudWatch Log Groups** for application logs
- **IAM Roles** for ECS task execution

## Accessing Your Application

After deployment completes (5-10 minutes):

1. Get the Load Balancer URL:
   ```bash
   aws cloudformation describe-stacks --stack-name escal8-production --query "Stacks[0].Outputs[?OutputKey=='LoadBalancerURL'].OutputValue" --output text
   ```

2. Open the URL in your browser:
   - Frontend: `http://<load-balancer-dns>/`
   - Backend API: `http://<load-balancer-dns>/api/`
   - Health check: `http://<load-balancer-dns>/health`

## Updating the Application

### Update Backend:

```bash
cd backend
docker build -t escal8-backend:latest .
docker tag escal8-backend:latest 177099687548.dkr.ecr.us-east-1.amazonaws.com/escal8-backend:latest
docker push 177099687548.dkr.ecr.us-east-1.amazonaws.com/escal8-backend:latest

# Force new deployment
aws ecs update-service --cluster production-escal8-cluster --service production-escal8-backend-service --force-new-deployment --region us-east-1
```

### Update Frontend:

```bash
cd Escal8
docker build -t escal8-frontend:latest .
docker tag escal8-frontend:latest 177099687548.dkr.ecr.us-east-1.amazonaws.com/escal8-frontend:latest
docker push 177099687548.dkr.ecr.us-east-1.amazonaws.com/escal8-frontend:latest

# Force new deployment
aws ecs update-service --cluster production-escal8-cluster --service production-escal8-frontend-service --force-new-deployment --region us-east-1
```

## Monitoring

### View Logs:

```bash
# Backend logs
aws logs tail /ecs/production-escal8-backend --follow --region us-east-1

# Frontend logs
aws logs tail /ecs/production-escal8-frontend --follow --region us-east-1
```

### Check Service Status:

```bash
# Backend service
aws ecs describe-services --cluster production-escal8-cluster --services production-escal8-backend-service --region us-east-1

# Frontend service
aws ecs describe-services --cluster production-escal8-cluster --services production-escal8-frontend-service --region us-east-1
```

## Cost Optimization

- **ECS Fargate**: ~$0.04/hour per task (2 tasks = ~$58/month)
- **ALB**: ~$16/month
- **Data Transfer**: Variable based on usage
- **CloudWatch Logs**: ~$0.50/GB ingested

**Estimated Monthly Cost**: ~$75-100 for low traffic

### To Reduce Costs:

1. Stop services when not in use:
   ```bash
   aws ecs update-service --cluster production-escal8-cluster --service production-escal8-backend-service --desired-count 0 --region us-east-1
   aws ecs update-service --cluster production-escal8-cluster --service production-escal8-frontend-service --desired-count 0 --region us-east-1
   ```

2. Delete stack when done:
   ```bash
   aws cloudformation delete-stack --stack-name escal8-production --region us-east-1
   ```

## Custom Domain Setup (Optional)

1. **Register domain** in Route 53 or use existing
2. **Create ACM certificate** for HTTPS
3. **Update ALB** to use HTTPS listener
4. **Update CloudFormation** template to add certificate ARN

## Troubleshooting

### Containers not starting:
```bash
# Check task logs
aws ecs describe-tasks --cluster production-escal8-cluster --tasks <task-id> --region us-east-1

# View container logs in CloudWatch
```

### Can't access application:
- Verify security groups allow traffic on ports 80, 3000, 8000
- Check target group health in ALB console
- Verify environment variables are set correctly

### Build failures:
- Ensure Docker is running
- Check AWS credentials: `aws sts get-caller-identity`
- Verify you're logged into ECR

## Support

For issues or questions:
1. Check CloudWatch logs
2. Review ECS task definitions and services
3. Verify environment variables in task definitions

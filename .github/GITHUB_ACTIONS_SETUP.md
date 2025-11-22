# GitHub Actions AWS Deployment Setup

This guide explains how to set up GitHub Actions to automatically deploy Escal8 to AWS.

## Prerequisites

1. AWS Account (ID: 177099687548)
2. GitHub repository with admin access
3. AWS credentials (Access Key ID and Secret Access Key)

## Step 1: Create AWS IAM User for GitHub Actions

1. Go to AWS IAM Console
2. Create a new user: `github-actions-escal8`
3. Attach the following policies:
   - `AmazonEC2ContainerRegistryFullAccess`
   - `AmazonECS_FullAccess`
   - `CloudWatchLogsFullAccess`
   - Custom policy for CloudFormation:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:PutRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:GetRole",
        "iam:PassRole",
        "ec2:*",
        "elasticloadbalancing:*"
      ],
      "Resource": "*"
    }
  ]
}
```

4. Create access keys and save them securely

## Step 2: Add GitHub Secrets

Go to your GitHub repository settings and add these secrets:

### Required Secrets:

| Secret Name             | Description                     | Example                                    |
| ----------------------- | ------------------------------- | ------------------------------------------ |
| `AWS_ACCESS_KEY_ID`     | AWS Access Key ID from IAM user | `AKIAIOSFODNN7EXAMPLE`                     |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Access Key           | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `SUPABASE_URL`          | Your Supabase project URL       | `https://xxx.supabase.co`                  |
| `SUPABASE_KEY`          | Your Supabase anon/public key   | `eyJhbGc...`                               |
| `ELEVENLABS_API_KEY`    | Your ElevenLabs API key         | `sk_xxx...`                                |

### How to Add Secrets:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret from the table above

## Step 3: Workflow Configuration

The workflow file `.github/workflows/deploy-aws.yml` is already configured with:

- **Trigger**: Automatically deploys on push to `main` branch
- **Manual Trigger**: Can be triggered manually via GitHub Actions tab
- **Environment**: Deploys to AWS account 177099687548 in us-east-1 region

### Workflow Steps:

1. ✅ Checkout code
2. ✅ Configure AWS credentials
3. ✅ Login to Amazon ECR
4. ✅ Create ECR repositories (if needed)
5. ✅ Build and push Backend Docker image
6. ✅ Build and push Frontend Docker image
7. ✅ Deploy/Update CloudFormation stack
8. ✅ Force new ECS deployments
9. ✅ Display application URL

## Step 4: First Deployment

### Option A: Push to Main Branch

```bash
git add .
git commit -m "Add AWS deployment with GitHub Actions"
git push origin main
```

The workflow will automatically run.

### Option B: Manual Trigger

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Deploy Escal8 to AWS** workflow
4. Click **Run workflow** button
5. Select `main` branch
6. Click **Run workflow**

## Step 5: Monitor Deployment

1. Go to **Actions** tab in your GitHub repository
2. Click on the running workflow
3. Watch the progress in real-time
4. Once complete, the deployment summary will show your application URL

## Deployment Times

- **First deployment**: ~10-15 minutes (creates all infrastructure)
- **Subsequent deployments**: ~5-7 minutes (updates existing services)

## Customizing the Workflow

### Change AWS Region:

Edit `.github/workflows/deploy-aws.yml`:

```yaml
env:
  AWS_REGION: ap-southeast-2 # Change to your region
```

### Change Stack Name:

Replace `escal8-production` with your desired stack name throughout the file.

### Add Staging Environment:

Create a new workflow file `.github/workflows/deploy-staging.yml` and change:

```yaml
on:
  push:
    branches:
      - develop # Deploy staging from develop branch

env:
  ECS_CLUSTER: staging-escal8-cluster
  # ... other staging-specific values
```

## Viewing Deployment Output

After deployment completes:

1. Check the **Deployment Summary** in the workflow run
2. Click on the Load Balancer URL to access your application
3. View logs in AWS CloudWatch

## Troubleshooting

### Build Failures:

- Check Docker build logs in the workflow output
- Ensure Dockerfile exists in correct locations

### Stack Creation Failures:

- Verify AWS credentials have correct permissions
- Check CloudFormation events in AWS Console
- Ensure secrets are set correctly in GitHub

### Service Update Failures:

- Verify ECS cluster and service names
- Check if stack was created successfully
- Review ECS task logs in CloudWatch

## Rolling Back

To rollback to a previous version:

1. Go to **Actions** tab
2. Find the successful deployment you want to rollback to
3. Click **Re-run all jobs**

Or manually update the ECS service to use a previous task definition.

## Cost Monitoring

After deployment, monitor costs in AWS Cost Explorer:

- ECS Fargate: ~$58/month (2 tasks running 24/7)
- ALB: ~$16/month
- Data Transfer: Variable
- CloudWatch Logs: ~$0.50/GB

**Total estimated cost**: ~$75-100/month for low traffic

## Cleanup

To destroy all resources:

```bash
aws cloudformation delete-stack --stack-name escal8-production --region us-east-1
```

Or create a cleanup workflow:

```yaml
name: Destroy AWS Infrastructure
on:
  workflow_dispatch:
    inputs:
      confirm:
        description: 'Type "destroy" to confirm'
        required: true

jobs:
  destroy:
    runs-on: ubuntu-latest
    if: github.event.inputs.confirm == 'destroy'
    steps:
      - name: Delete CloudFormation Stack
        run: |
          aws cloudformation delete-stack \
            --stack-name escal8-production \
            --region us-east-1
```

## Security Best Practices

1. ✅ Use GitHub Secrets for sensitive data
2. ✅ Enable branch protection for `main` branch
3. ✅ Require pull request reviews before merging
4. ✅ Enable AWS CloudTrail for audit logging
5. ✅ Rotate AWS access keys regularly
6. ✅ Use least-privilege IAM policies

## Next Steps

1. **Add HTTPS**: Set up ACM certificate and update ALB
2. **Custom Domain**: Configure Route 53 DNS
3. **Monitoring**: Set up CloudWatch alarms
4. **Auto-scaling**: Configure ECS auto-scaling based on CPU/memory
5. **CI/CD Improvements**: Add automated testing before deployment

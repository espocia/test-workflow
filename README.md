# Node.js ECS Test Project

A simple Node.js Express API designed for learning AWS ECS deployment.

## Features

- Express.js REST API
- Environment variable support with dotenv
- Health check endpoint for ECS
- Docker containerization
- Production-ready configuration

## Local Development

### Prerequisites

- Node.js 18+ installed
- Docker installed (for container testing)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Edit the `.env` file with your settings.

3. Run locally:
```bash
npm start
```

The server will start on `http://localhost:3000`

### Available Endpoints

- `GET /` - Welcome message with app info
- `GET /health` - Health check endpoint (used by ECS)
- `GET /api/info` - Detailed application information
- `POST /api/echo` - Echo endpoint that returns the request body

### Test the API

```bash
# Health check
curl http://localhost:3000/health

# Get app info
curl http://localhost:3000/api/info

# Echo endpoint
curl -X POST http://localhost:3000/api/echo \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}'
```

## Docker

### Build the image:
```bash
docker build -t nodejs-ecs-test .
```

### Run the container:
```bash
docker run -p 3000:3000 -e NODE_ENV=production nodejs-ecs-test
```

### Test the containerized app:
```bash
curl http://localhost:3000/health
```

## AWS ECS Deployment

### 1. Create ECR Repository

```bash
aws ecr create-repository --repository-name nodejs-ecs-test --region us-east-1
```

### 2. Authenticate Docker to ECR

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
```

### 3. Tag and Push Image

```bash
docker tag nodejs-ecs-test:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/nodejs-ecs-test:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/nodejs-ecs-test:latest
```

### 4. Create ECS Task Definition

Create a task definition with:
- Container image: `<account-id>.dkr.ecr.us-east-1.amazonaws.com/nodejs-ecs-test:latest`
- Port mapping: 3000
- Environment variables (in task definition):
  - `NODE_ENV=production`
  - `APP_NAME=nodejs-ecs-test`
  - `PORT=3000`
- Health check: Command `CMD-SHELL, curl -f http://localhost:3000/health || exit 1`

### 5. Create ECS Service

- Choose Fargate or EC2 launch type
- Configure desired count (e.g., 2 tasks)
- Set up Application Load Balancer (ALB)
- Configure target group with `/health` as health check path
- Set security groups to allow traffic on port 3000

### 6. Environment Variables in ECS

You can set environment variables in:
- **Task Definition**: For static configuration
- **Secrets Manager**: For sensitive data (recommended)
- **Parameter Store**: For configuration values

Example in task definition:
```json
"environment": [
  {"name": "NODE_ENV", "value": "production"},
  {"name": "APP_NAME", "value": "nodejs-ecs-test"},
  {"name": "PORT", "value": "3000"}
]
```

## Project Structure

```
.
├── index.js           # Main application file
├── package.json       # Dependencies and scripts
├── Dockerfile         # Docker configuration
├── .dockerignore      # Files to exclude from Docker
├── .env              # Environment variables (local)
└── README.md         # This file
```

## Environment Variables

| Variable    | Description              | Default            |
|-------------|--------------------------|-------------------|
| PORT        | Server port              | 3000              |
| NODE_ENV    | Environment (dev/prod)   | development       |
| APP_NAME    | Application name         | nodejs-ecs-test   |

## Next Steps for Learning ECS

1. Set up auto-scaling for your ECS service
2. Configure CloudWatch logs and monitoring
3. Implement blue/green deployments
4. Set up CI/CD pipeline with CodePipeline
5. Add RDS database integration
6. Configure service discovery
7. Implement task secrets using AWS Secrets Manager

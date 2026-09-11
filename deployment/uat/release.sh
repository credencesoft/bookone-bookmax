#!/bin/bash

# set -e

DOCKER_REPO_URL=912195358089.dkr.ecr.us-east-1.amazonaws.com
DOCKER_IMAGE=webui-pms-website
DOCKER_TAG=latest
REGION=us-east-1
TASK_DEF_NAME=webui-pms-website
ECS_SERVICE_NAME=webui-pms-website
CLUSTER_NAME=bookone

# Login to AWS ECR Docker Repository - This requires awscli to be installed and configured

# docker system prune -af
echo 'building docker image'
docker build -t $DOCKER_REPO_URL/$DOCKER_IMAGE:$DOCKER_TAG .
echo "Docker build done. New tag=$DOCKER_TAG"

echo 'generating ecr access token'
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $DOCKER_REPO_URL

echo 'uploading docker image into ecr'
docker push $DOCKER_REPO_URL/$DOCKER_IMAGE:$DOCKER_TAG

# echo 'updating ecs service'
aws ecs update-service --force-new-deployment --cluster $CLUSTER_NAME --service $ECS_SERVICE_NAME --task-definition $TASK_DEF_NAME --region $REGION --desired-count 1

echo "Done!!"

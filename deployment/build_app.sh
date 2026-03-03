#!/bin/bash
# ls
env_name=$1
echo "reading config file resource_refs.$env_name.json"
config_file="deployment/resource_refs.$env_name.json"

# default_region=$(jq --raw-output ".default_region" $config_file)
# ecr_repo_uri=$(jq --raw-output ".ecr_repo_uri" $config_file)
# aws_account_id=$(jq --raw-output ".aws_account_id" $config_file)
# version=$(jq --raw-output ".version" $config_file)

default_region=$(grep -o '"default_region": *"[^"]*"' "$config_file" | grep -o '"[^"]*"$' | tr -d '"')
ecr_repo_uri=$(grep -o '"ecr_repo_uri": *"[^"]*"' "$config_file" | grep -o '"[^"]*"$' | tr -d '"')
aws_account_id=$(grep -o '"aws_account_id": *"[^"]*"' "$config_file" | grep -o '"[^"]*"$' | tr -d '"')
version=$(grep -o '"version": *"[^"]*"' "$config_file" | grep -o '"[^"]*"$' | tr -d '"')

echo "default_region=$default_region"
echo "ecr_repo_uri=$ecr_repo_uri"
echo "aws_account_id=$aws_account_id"
echo "version=$version"

echo "Building docker images. It may take a while. Please wait."

# docker build

if [ "$env_name" = "prod" ]; then
    echo "production build"
    docker build --build-arg CONFIGURATION=mumbai -t $ecr_repo_uri .
elif [ "$env_name" = "uat" ]; then
    echo "test build"
    docker build --build-arg CONFIGURATION=test -t $ecr_repo_uri .
fi

# ecr login
aws ecr get-login-password --region $default_region | docker login --username AWS --password-stdin $aws_account_id.dkr.ecr.$default_region.amazonaws.com

echo "ECR upload access granted"

echo "Uploading docker images. It may take a while. Please wait."
# upload to ecs repo
docker push $ecr_repo_uri
echo "Upload finished. repo uri: $ecr_repo_uri"

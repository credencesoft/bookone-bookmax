#!/bin/bash

# env_name=$1
env_name='prod'
echo "reading config file resource_refs.$env_name.json"
config_file="deployment/resource_refs.$env_name.json"

# ecs_task_def_name=$(jq --raw-output ".ecs_task_def_name" $config_file)
# ecs_service_name=$(jq --raw-output ".ecs_service_name" $config_file)
# ecs_cluster_name=$(jq --raw-output ".ecs_cluster_name" $config_file)

ecs_task_def_name=$(grep -o '"ecs_task_def_name": *"[^"]*"' "$config_file" | grep -o '"[^"]*"$' | tr -d '"')
ecs_service_name=$(grep -o '"ecs_service_name": *"[^"]*"' "$config_file" | grep -o '"[^"]*"$' | tr -d '"')
ecs_cluster_name=$(grep -o '"ecs_cluster_name": *"[^"]*"' "$config_file" | grep -o '"[^"]*"$' | tr -d '"')

echo "ecs_task_def_name=$ecs_task_def_name"
echo "ecs_service_name=$ecs_service_name"
echo "ecs_cluster_name=$ecs_cluster_name"

echo "Creating new revision of task definition $ecs_task_def_name"

aws ecs register-task-definition --family $ecs_task_def_name --cli-input-json "file://deployment/task_definition.$env_name.json" --region ap-south-1

revision=$(aws ecs describe-task-definition --task-definition $ecs_task_def_name --region ap-south-1 | grep "revision" | tr -s " " | cut -d " " -f 3)

echo "new revision no: ${revision}"

aws ecs update-service --cluster $ecs_cluster_name --service $ecs_service_name --task-definition $ecs_task_def_name --region ap-south-1 --desired-count 1

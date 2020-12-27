#!/usr/bin/env bash

sudo systemctl start docker.service
docker start zn_mongo

echo "docker exec -it zn_mongo bash"

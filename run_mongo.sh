#!/usr/bin/env bash

sudo systemctl start docker.service
#docker start zn_mongo
## OR
docker run --name "zn_mongo" -d -p 127.0.0.1:27017:27017 mongo

# docker exec -it zn_mongo bash

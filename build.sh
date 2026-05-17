#!/bin/sh

docker buildx build --platform linux/amd64 -t uportal/angular-21-jwt-auth -f Dockerfile .

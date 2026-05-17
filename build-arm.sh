#!/bin/sh


docker buildx build --platform linux/arm64 -t uportal/angular-21-jwt-auth -f Dockerfile .

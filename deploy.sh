#!/bin/sh
echo "PORT=$PORT"
git fetch origin && git reset --hard origin/staging && git clean -f -d
docker-compose -f docker-compose.dev.yml up -d --build
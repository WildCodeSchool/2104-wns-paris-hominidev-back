#!/bin/sh
echo "PORT=$PORT"
git fetch origin && git reset --hard origin/dev && git clean -f -d
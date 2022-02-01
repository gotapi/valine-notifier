#!/usr/bin/env bash
rsync -rv --exclude=".iea" --exclude=".git" --exclude="node_modules" ./ root@404.ms:/root/gosite/comment-notify/
ssh root@404.ms supervisorctl restart mailapp 

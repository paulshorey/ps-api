#!/bin/bash

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/gitlab
cd /www/ps-api
git reset HEAD -\-hard;
git pull

pm2 restart all 
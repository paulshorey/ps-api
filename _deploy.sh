#!/bin/bash

eval "$(ssh-agent -s)";
ssh-add ~/.ssh/gitlab;
cd /www/ps-api;
git reset HEAD -\-hard;
git pull;
npm install;

pm2 restart all;
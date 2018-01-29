sleep 20

cd /www/ps-api

mkdir ./api_public/v1/console/logfiles;
pm2 start _deploy.js -o ./api_public/v1/console/logfiles/_deploy_log.log -e ./api_public/v1/console/logfiles/_deploy_err.log
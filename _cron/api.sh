# attempt to renew SSL before messing with port :80
# /opt/letsencrypt/letsencrypt-auto renew
# /etc/init.d/nginx reload


# start app
iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 1080
iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 1443
ufw allow 80/tcp
ufw allow 443/tcp

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/gitlab
cd /www/ps-api
git reset HEAD -\-hard;
git pull;

mkdir ./api_public/v1/console/logfiles;
pm2 start  api.js -i max -o ./api_public/v1/console/logfiles/_api_log.log -e ./api_public/v1/console/logfiles/_api_err.log
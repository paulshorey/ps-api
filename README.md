# 
# API Server
Setup and configuration for this and any Linux (Ubuntu) NodeJS/MongoDB/Nginx server explained here:
https://paulshorey.gitbooks.io/node-js-nginx-and-linux-server-management/content/  
### 
This is run on system startup (explained in the above link, in /etc/crontab):  
```
bash /www/ps-api/_cron/deploy.sh  
bash /www/ps-api/_cron/api.sh  
```  
Those system scripts start these Node.js scripts:  
```
{codebase}/_deploy.js  // this listens for webhook request from Github, then pulls and restarts processes
{codebase}/api.js  // this is the app, using Node.js and Express  
```  

# 
# Primary functions of this server:  

## 
## File server   
NGINX serves files from {this-repo}/build  

## 
## API requests  
NodeJS /api.js process listens for REST requests {port 80 rerouted to port 1080}  

## 
## Deploy  
NodeJS /\_deploy.js process listens for POST request at port :9999/\_deploy  

## 
## Chat  
NodeJS /api/v1/chat websocket connection at port :1101/v1/chat/WS  
http://paulshorey.com  

## 
## Console  
NodeJS /api/v1/console/src/console.js websocket connection at port :1102/v1/console/WS  
http://api.paulshorey.com/v1/console/

## 
## Jobs 
APIFY service crawls Indeed.com and Careerbuilder.com, nationwide, searching for "javascript". It returns 1000 results from Indeed and 500+ from Careerbuilder. After the crawl is done, this server is notified at POST __/v1/jobs/apify-webhook__. Then, this server goes and fetches the new results from APIFY's server. Wish the webhook would just send this data, but whatever... Then, the results are filtered, made unique, and rated. Then, a GET request to http://api.paulshorey.com/v1/jobs/all spits out a sorted array of jobs in JSON format.  



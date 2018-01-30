#
# Simple API Server
Documenting setup and configuration for a Linux (Ubuntu) NodeJS/MongoDB/Nginx server here:
https://paulshorey.gitbooks.io/node-js-nginx-and-linux-server-management/content/


#
# Primary functions of this server:  

## 
## File server   
NGINX serves files from {this-repo}/build  

## 
## API requests  
NodeJS /api.js process listens to {requests at port 1080 rerouted to port 80}  

## 
## Deploy  
NodeJS /\_deploy.js process listens to port :9999/\_deploy  

## 
## Chat  
NodeJS /api/v1/chat websocket connection at port :1101/v1/chat/WS  
Demo at http://paulshorey.com  

## 
## Console  
NodeJS /api/v1/console/src/console.js websocket connection at port :1102/v1/console/WS  
http://api.paulshorey.com:1080/v1/console/

## 
## Jobs 
APIFY service crawls Indeed.com and Careerbuilder.com, nationwide, searching for "javascript". It returns 1000 results from Indeed and 500+ from Careerbuilder. After the crawl is done, this server is notified at POST _/v1/jobs/apify-webhook_. Then, this server goes and fetches the new results from APIFY's server. Wish the webhook would just send this data, but whatever... Then, the results are filtered, made unique, and rated. Then, a GET request to _/v1/jobs/all_ spits out a sorted array of jobs in JSON format.  



#
# Simple API Server
Read more on setup and configuration:
https://paulshorey.gitbooks.io/nginx-server-management/content/the-api.html


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

## 
## Console  
NodeJS /api/v1/console/src/console.js websocket connection at port :1102/v1/console/WS



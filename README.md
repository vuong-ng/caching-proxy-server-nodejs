# Caching Proxy Server

## Installation
This Proxy is written in JavaScript. Ensure to install Node.js and npm 
```
npm --version
node --version
```

1. Clone this repo:
```
git clone https://github.com/vuong-ng/caching-proxy-server-nodejs.git
```
2. Install dependencies:
```
npm install
```

## Usage:
### Starting the proxy server
This proxy server can be started by running the following command:
```
caching-proxy-server --port <number> --origin <url>
```
For example, is the user want the server to listening on port 3000 and forward requests to `http://dummyjson.com`:
```
caching-proxy-server % caching-proxy-server start --port 3000 --origin http://dummyjson.com
```

If the user makes a request to http://localhost:3000/products, the caching proxy server should forward the request to http://dummyjson.com/products, return the response along with headers and cache the response. 
An example of request can look like:
```
curl http://localhost:3000/products
```
If the response is from the cache `X-Cache: HIT` is in included in the reponse headers. If the response is from the origin server `X-Cache: MISS` will be returned with the header.
An emxaple of response for request to `http://dummyjson.com/products`:
```
HTTP/1.1 200 OK
X-Powered-By: Express
X-cache: HIT
Date: Sat, 07 Jun 2025 21:55:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 0
```
### Clear the cache
To clear cache, run:
```
caching-proxy-server clear-cache
```

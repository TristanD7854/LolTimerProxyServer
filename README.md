# LolTimerProxyServer
Node proxy server for lol timer application

Use express

Use dotenv : for environment variable, where we want to save the api key

Use needle : http client, lightweight

Use nodemon, its like ng serve for node server

Use express-rate-limit for rate limiting

Use apicache for caching

## How this works

The frontend will make the request to this server, we'll use needle in this server to make a request to the public API

# Start

npm start

# Dev

npm run dev
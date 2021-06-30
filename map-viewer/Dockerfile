# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
#FROM node:16-slim
### Name the node stage "builder"
FROM node:16-alpine AS builder

# Create and change to the app directory.
#WORKDIR /usr/src/app
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install dependencies.
# If you add a package-lock.json speed your build by switching to 'npm ci'.
# RUN npm ci --only=production
RUN npm install --production

# Copy local code to the container image.
COPY . ./

### Create production build of React App
RUN npm run build

### Choose NGINX as our base Docker image
FROM nginx:alpine

#### Copy our nginx configuration
COPY nginx.conf /etc/nginx/conf.d/configfile.template

### Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

### Remove default nginx static assets
RUN rm -rf *

### Copy static assets from builder stage
COPY --from=builder /app/build .

# Run the web service on container startup.
#CMD ["node", "./public/index.html"]
#### Entry point when Docker container has started
#ENTRYPOINT ["nginx", "-g", "daemon off;"]

# Define environment variables for Cloud Run
ENV PORT 8080
ENV HOST 0.0.0.0
EXPOSE 8080

# Substitute $PORT variable in config file with the one passed via "docker run"
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"

# Stage 1: Build the UI
# Use a node image that includes bun, or a bun-specific image if available
FROM node:22.12-alpine3.19 AS ui-builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json ./

# Change directory to /ui, install dependencies and build the UI
RUN npm ci

# Copy the current directory contents into the container at /app
COPY . .

# Set the GITHUB_SHA environment variable for Sentry release tracking
ARG GITHUB_SHA ""
ENV GITHUB_SHA ${GITHUB_SHA}

RUN NODE_OPTIONS=--max_old_space_size=4096 npm run build

# Stage 2: Serve the UI with Nginx
FROM nginx:alpine

# Copy built UI artifacts from the previous stage to the nginx serving directory
COPY --from=ui-builder /app/dist /usr/share/nginx/html

# Overwrite the default nginx configuration with our custom one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the Docker host, so we can access the container
EXPOSE 80

# Start Nginx and keep the process running
CMD ["nginx", "-g", "daemon off;"]

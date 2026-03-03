FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app/pms-webui

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the entire directory into the container
COPY . .

# Install the app's dependencies
RUN npm install --force

# Build the app
# RUN ng build

# This assumes the "demoSSR:server" script exists in your package.json
# RUN npm run demoSSR:server

RUN ng build

# Expose the port
EXPOSE 4200

# Start the server
CMD npm run dev:ssr

# Use official Node.js image as base
FROM node:18-alpine AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application
COPY . .

# Build the Angular app for production with SSR
RUN npm run build 
RUN npm run build:ssr

# Stage 2: Use a small image for production
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the built Angular app from the previous stage
COPY --from=build /usr/src/app/dist /usr/src/app/dist

# Expose the port the app runs on
EXPOSE 4200
EXPOSE 9229

# Define the command to run the app
# CMD ["node", "dist/server/main.js"]
# CMD node dist/demoSSR/server/main.js
CMD node --inspect=0.0.0.0:9229 dist/demoSSR/server/main.js
# CMD npm run  serve:ssr
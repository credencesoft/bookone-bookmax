# ================================================================
# Stage 1 - Build
# ================================================================
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY . .

# Build both browser and SSR bundles
RUN npm run build
RUN npm run build:ssr

# ================================================================
# Stage 2 - Production (lean image, no devDependencies)
# ================================================================
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy only built output from build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json

# Set production environment
ENV NODE_ENV=production
ENV PORT=4200

EXPOSE 4200

# Run SSR server in production mode (no inspect/debug)
CMD ["node", "dist/demoSSR/server/main.js"]

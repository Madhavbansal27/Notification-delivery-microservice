# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy only package manifests first to leverage Docker cache for dependencies.
COPY package*.json ./

# Install dependencies including dev dependencies so TypeScript can compile.
RUN npm ci --include=dev

# Copy all application source files.
COPY . .

# Provide a build-time placeholder DATABASE_URL so Prisma can validate the schema.
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prisma"

# Generate Prisma client after schema is available.
RUN npx prisma generate

# Build the TypeScript application.
RUN npm run build

# Ensure the runtime user can access the app files.
RUN chown -R node:node /usr/src/app
USER node

# Expose the application port.
EXPOSE 9000

# Run the compiled production server.
CMD ["npm", "start"]

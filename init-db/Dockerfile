# Copyright Talkersoft LLC
# /init-db/Dockerfile
FROM node:16

# Create and set the working directory
WORKDIR /app

# Copy package.json and yarn.lock from the init-db directory to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code from the init-db directory to the working directory
COPY . .

# Install TypeScript globally
RUN yarn global add typescript

# Compile TypeScript files
RUN yarn run tsc

# Default command to run the init-db script (this can be overridden)
CMD ["yarn", "start"]

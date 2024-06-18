# Use the official Node.js image as the base image
FROM node:16

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json from the init-db directory to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code from the init-db directory to the working directory
COPY . .

# Install TypeScript globally
RUN npm install -g typescript

# Compile TypeScript files
RUN npx tsc

# Default command to run the init-db script (this can be overridden)
CMD ["npx", "ts-node", "src/init-db.ts"]

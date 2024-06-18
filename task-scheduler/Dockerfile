# Use the official Node.js image as the base image
FROM node:16

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the root package.json and yarn.lock files
COPY package.json yarn.lock ./
# Copy the package.json files of the workspaces
COPY task-scheduler/package.json task-scheduler/
COPY task-scheduler-entities/package.json task-scheduler-entities/
# Install dependencies including workspaces
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the TypeScript code
RUN yarn workspace task-scheduler-entities run build
RUN yarn workspace task-scheduler run build

# Expose the port the app runs on (if needed)
# EXPOSE 3000

# Run the application
CMD ["yarn", "workspace", "task-scheduler", "run", "start"]

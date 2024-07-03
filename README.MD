# Task Scheduler Project

## Overview
This project sets up a task scheduler system using Docker and Docker Compose. It includes multiple services such as PostgreSQL, RabbitMQ, and various task processing components.

## Prerequisites
- Docker
- Docker Compose
- Git

## Services
- **PostgreSQL**: Database service.
- **RabbitMQ**: Message broker service with management UI.
- **init-db**: Initializes the PostgreSQL database.
- **task-scheduler-api**: API for the task scheduler.
- **task-scheduler**: Main task scheduler service.
- **task-distributor**: Distributes tasks to processors.
- **task-processor-1, task-processor-2, task-processor-3**: Task processing services.

## Docker Compose Setup
The `docker-compose.yml` file defines all the services and their configurations. The following sections describe each service and its environment variables.

## Volumes
- **postgres_data**: Persistent storage for PostgreSQL data.

## Scripts
- **scripts/app-run.sh**: Builds and starts the Docker containers.
- **scripts/re-yarn.sh**: Installs and builds the Node.js workspaces.
- **scripts/app-tear-down.sh**: Stops and removes the Docker containers and cleans up the data.

## How to Run

### Step 1: Clone the repository
```sh
git clone https://github.com/talkersoft/distributed-task-scheduler
```

### Step 2: Run the backend
- note: app-run.sh executes re-yarn.sh which is required for step 3.
```sh
cd distributed-task-scheduler
./scripts/app-run.sh
```

### Step 3: Run the frontend (open new terminal)
```sh
cd distributed-task-scheduler
echo "REACT_APP_API_URL=http://localhost:5001/api" > frontend/task-scheduler-web/.env
./scripts/re-yarn.sh
cd frontend/task-scheduler-web
yarn start
```

### Step 4: Optional Storybook (open new terminal)
```sh
cd distributed-task-scheduler
./scripts/re-yarn.sh
cd frontend/storybook
yarn start
```


### Rebuild Node.js workspace
- If needed, you can clean and reinstall all Node.js dependencies and rebuild the workspaces.
```sh
./scripts/re-yarn-run.sh

// deletes node_modules
./scripts/re-yarn.sh --nuke
```

### Tear down app and clear persistant data
```sh
// deletes data volume dir for postgres database
./scripts/app-tear-down.sh 
```


## Notes
- Make sure to navigate using cd to anywhere in the Git repository before running scripts.
- For the `app-tear-down.sh` script, confirm the operation by typing 'yes' when prompted.


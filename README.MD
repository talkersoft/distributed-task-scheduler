# Distributed Task Scheduler

## Prerequisites

Ensure you have the following installed on your local machine:

1. **Docker**: To run PostgreSQL and other services in containers.
2. **Docker Compose**: To orchestrate multiple Docker containers.
3. **Node.js and npm**: To install dependencies.

## Setup Instructions

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd <your-repo-directory>
```

### 2. Install Dependencies

Navigate to the `init-db` directory and install the dependencies:

```sh
cd init-db
npm install
cd ..
```

### 3. Create the Directory for PostgreSQL Data

```sh
mkdir -p ~/.docker/data/task-scheduler
```

### 4. Build and Start the Services Using Docker Compose

```sh
docker-compose up -d
```

### 5. Check the Logs to Ensure Initialization

```sh
docker-compose logs init-db
```

### 6. Stop Services

```sh
docker-compose down
```

### Troubleshoot container
```sh
docker-compose down
```
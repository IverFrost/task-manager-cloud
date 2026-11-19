
# Task Manager — Cloud Deployment

A full-stack task management application built with React, FastAPI and PostgreSQL, containerized with Docker and deployed on Microsoft Azure.

## Live application

- **Frontend:** [https://sttaskmgriverfrost26.z43.web.core.windows.net/](https://sttaskmgriverfrost26.z43.web.core.windows.net/)

- **Backend API:** [https://ca-task-manager-api.delightfulground-86fcd847.spaincentral.azurecontainerapps.io/](https://ca-task-manager-api.delightfulground-86fcd847.spaincentral.azurecontainerapps.io/)

- **API health check:** [https://ca-task-manager-api.delightfulground-86fcd847.spaincentral.azurecontainerapps.io/health](https://ca-task-manager-api.delightfulground-86fcd847.spaincentral.azurecontainerapps.io/health)


## Architecture

The application consists of three main services:

|Component|Technology|Deployment|
|---|---|---|
|Frontend|React, Vite, Nginx|Azure Blob Storage static website|
|Backend|Python, FastAPI, SQLAlchemy|Azure Container Apps|
|Database|PostgreSQL 17|Azure Database for PostgreSQL Flexible Server|

The frontend communicates with the FastAPI backend through HTTP requests. The backend handles task operations and stores the data in PostgreSQL.

## Features

- Create, edit and delete tasks.

- Mark tasks as completed or pending.

- Filter tasks by status.

- Display task statistics.

- Persistent database storage.

- Responsive user interface.

- API health-check endpoint.


## Run locally with Docker Compose

### Requirements

- Docker

- Docker Compose


### Start the application

Clone the repository:

```
git clone <REPOSITORY_URL>
cd task-manager-cloud
```

Build and start the services:

```
docker compose up -d --build
```

The application will be available at:

- Frontend: [http://localhost:5173](http://localhost:5173)

- Backend API: [http://localhost:8000](http://localhost:8000)

- API documentation: [http://localhost:8000/docs](http://localhost:8000/docs)


### Stop the application

```
docker compose down
```

The PostgreSQL database uses a Docker volume named `postgres_data` to preserve data between container restarts. Avoid `docker compose down -v` unless you intend to delete that data.

**Note:** The local Compose configuration uses development-only database credentials. These are separate from the production Azure database credentials.

## API endpoints

|Method|Endpoint|Description|
|---|---|---|
|GET|`/health`|Check API health|
|GET|`/tasks`|Retrieve all tasks|
|POST|`/tasks`|Create a task|
|PUT|`/tasks/{task_id}`|Update a task|
|DELETE|`/tasks/{task_id}`|Delete a task|

## Cloud deployment

The application is deployed on Microsoft Azure using:

- **Azure Blob Storage:** Hosts the frontend as a static website.

- **Azure Container Apps:** Runs the containerized FastAPI backend.

- **Azure Database for PostgreSQL Flexible Server:** Provides managed persistent database storage.


The backend connects to PostgreSQL using a connection string stored as an Azure Container Apps secret. Database communication uses SSL/TLS.

## Security and configuration

- Production database credentials are stored as Azure secrets, not in the source code.

- The frontend API address is configured at build time using `VITE_API_URL`.

- CORS is configured to allow the deployed frontend and local development origins.

- Docker build contexts exclude unnecessary files through `.dockerignore`.


## Technologies

Python · FastAPI · SQLAlchemy · PostgreSQL · React · Vite · JavaScript · Docker · Nginx · Microsoft Azure
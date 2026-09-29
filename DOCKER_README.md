# Smart Farming Application - Docker Configuration

This document provides instructions on how to use Docker Compose to run the Smart Farming application locally. 

The provided `docker-compose.yml` configures and runs three services:
1. **MySQL Database** (`mysql:8.0`) - Running on port `3306`
2. **Python AI Service** (FastAPI) - Running on port `8000`
3. **Spring Boot Backend** - Running on port `8080`

The React frontend has been intentionally left out of this configuration and must be run separately using `npm run dev` (it connects to `http://localhost:8080/api`).

## Environment Variables
The application uses environment variables for configuration. You can create a `.env` file in the same directory as the `docker-compose.yml` file to override the default values:

```env
# Example .env file
DB_USER=root
DB_PASSWORD=root
JWT_SECRET=your_super_secret_jwt_key_here
CORS_ORIGINS=http://localhost:5173
```
If you do not provide a `.env` file, the system will use safe default values intended for local development.

## Commands

### 1. Build the containers
Build (or rebuild) the images for the Spring Boot backend and the Python FastAPI service:
```bash
docker compose build
```

### 2. Start the application
Start all services (MySQL, FastAPI, and Spring Boot). The `-d` flag runs them in the background (detached mode):
```bash
docker compose up -d
```
*Note: The Spring Boot backend depends on both MySQL and the FastAPI service. It will wait for both of them to report as "healthy" before it begins starting up. This may take up to 30 seconds.*

To view the logs and monitor the startup process:
```bash
docker compose logs -f
```

### 3. Stop the application
To stop the running containers without removing their data (MySQL data is persisted in a Docker volume):
```bash
docker compose down
```

If you want to completely wipe the database data along with stopping the containers, you can remove the volumes:
```bash
docker compose down -v
```

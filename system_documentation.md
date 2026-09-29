# Smart Farming Management System - Documentation

## 1. System Architecture

The Smart Farming Management System is a full-stack, microservices-oriented application designed to help farmers manage their farms, track expenses, predict yields, and get crop recommendations using Machine Learning.

### Architecture Overview

- **Frontend**: React (Vite)
- **Primary Backend Gateway**: Spring Boot (Java 17)
- **AI/ML Service**: FastAPI (Python 3.11)
- **Database**: MySQL 8
- **Authentication**: JWT (JSON Web Tokens)

**Communication Flow**:
React Frontend → HTTP/REST → Spring Boot Backend → HTTP/REST → Python AI Service

---

## 2. MySQL Database Schema

The database `smart_farming_db` consists of the following key tables:

- **users**: Stores authentication credentials and role (`FARMER`).
- **farmer_profiles**: Stores personal information linked to `users`.
- **farms**: Stores farm metadata (name, location, size) linked to `farmer_profiles`.
- **seasons**: Represents a farming season (crop, year, season name) linked to `farms`.
- **soil_reports**: Stores NPK, pH, and climate data linked to `seasons`.
- **expenses**: Ledger for tracking costs (seeds, fertilizer, labour, etc.) linked to `seasons`.
- **activities**: Farm diary for logging daily activities linked to `seasons`.
- **harvests**: Records yield quantity, selling price, and total income linked to `seasons`.

---

## 3. Spring Boot API Endpoints (Gateway)

Base URL: `http://localhost:8080`

### Authentication
- `POST /auth/register` : Register a new user
- `POST /auth/login` : Authenticate and receive JWT token

### Farmer Profile & Farm Management (Requires JWT)
- `POST /api/profile` : Create farmer profile
- `GET /api/profile` : Get farmer profile
- `POST /api/farms` : Register a new farm
- `GET /api/farms` : List all farms owned by the user

### Season & Crop Management (Requires JWT)
- `POST /api/farms/{farmId}/seasons` : Create a farming season
- `GET /api/farms/{farmId}/seasons` : Get all seasons for a farm
- `POST /api/seasons/{seasonId}/soil-reports` : Add a soil report
- `POST /api/seasons/{seasonId}/expenses` : Log an expense
- `GET /api/seasons/{seasonId}/expenses` : Get all expenses
- `POST /api/seasons/{seasonId}/activities` : Log daily activity
- `GET /api/seasons/{seasonId}/activities` : Get diary activities
- `POST /api/seasons/{seasonId}/harvests` : Record a harvest
- `GET /api/seasons/{seasonId}/harvests` : List harvests
- `GET /api/seasons/{seasonId}/profit` : Get comprehensive profit analysis

### External Integrations (Proxied via Spring Boot)
- `GET /api/weather` : Get mock weather data
- `GET /api/farms/{farmId}/weather` : Get mock weather for a specific farm
- `POST /api/ai/crop-recommendation` : Proxy to Python FastAPI for crop recommendation
- `POST /api/ai/yield-prediction` : Proxy to Python FastAPI for yield prediction

---

## 4. Python AI Service Endpoints

Base URL: `http://localhost:8000` (Internal only, not exposed to frontend)

- `GET /health` : Returns API health status.
- `POST /ai/crop-recommendation` : Accepts NPK, pH, and climate data to predict the most suitable crop using a Joblib-loaded Scikit-Learn Random Forest model.
- `POST /ai/yield-prediction` : Accepts farm inputs (area, rainfall, fertilizer) to predict the total yield using a trained ML regression model.

---

## 5. Running the Application

### Option A: Running with Docker (Recommended)

The entire application is containerized using Docker Compose. It requires Docker and Docker Compose installed on your machine.

1. **Build the containers**:
   ```bash
   docker compose build
   ```

2. **Start the system**:
   ```bash
   docker compose up
   ```
   *This starts MySQL, Spring Boot, and the Python FastAPI service simultaneously.*

3. **Stop the system**:
   ```bash
   docker compose down
   ```

### Option B: Running Locally (Development Mode)

If you prefer to run services manually for debugging:

1. **Start MySQL**:
   Ensure MySQL is running on port 3306 with a database named `smart_farming_db`.

2. **Start Python AI Service**:
   ```bash
   cd smart-farming-ai
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --port 8000
   ```

3. **Start Spring Boot Backend**:
   ```bash
   cd smart-farming-backend
   export DB_URL=jdbc:mysql://localhost:3306/smart_farming_db
   export JWT_SECRET=your_super_secret_key_here
   export CORS_ORIGINS=http://localhost:5173
   export AI_SERVICE_URL=http://localhost:8000
   ./mvnw spring-boot:run
   ```

4. **Start React Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Accessing the Applications
- **Frontend Dashboard**: `http://localhost:5173`
- **Spring Boot API**: `http://localhost:8080/api`
- **Python AI API**: `http://localhost:8000` (Internal)

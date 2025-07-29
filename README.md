# Nongpanya Project

This is a full-stack web application with a frontend built using Vue.js/Vite, a Node.js backend server, and a database setup using Docker.

## Prerequisites

- Node.js (v22 or higher)
- Docker and Docker Compose
- npm or yarn package manager

## Project Structure

```
nongpanya/
├── frontend/          # Vue.js/Vite frontend application
├── server/           # Node.js backend server
├── database/         # Database related files
│   ├── create_table.sql    # Database schema
│   └── insert_data.sql     # Mockup data for testing
├── config/           # Configuration files
└── docker-compose.yml # Docker compose configuration
```

## Setup Instructions

### 1. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with necessary environment variables:
   ```
    # MQTT (for ESP-based IoT device communication)
    VITE_MQTT_ENDPOINT=ws://your-mqtt-endpoint:9001
    # VITE_MQTT_ENDPOINT=wss://your-mqtt-endpoint-secure
    VITE_MQTT_USERNAME=your-mqtt-username
    VITE_MQTT_PASSWORD=your-mqtt-password

    # API Endpoints
    # VITE_API_URL=https://your-production-api-endpoint/api
    VITE_API_URL=http://localhost:3000/api
    VITE_URL=https://your-production-website-url
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. For development:
   ```bash
   npm run dev
   ```

6. For production build:
   ```bash
   npm run build
   ```

### 2. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with necessary environment variables:
   ```
    # MQTT (for ESP-based IoT device communication)
    VITE_MQTT_ENDPOINT=ws://your-mqtt-endpoint:9001
    # VITE_MQTT_ENDPOINT=wss://your-mqtt-endpoint-secure
    VITE_MQTT_USERNAME=your-mqtt-username
    VITE_MQTT_PASSWORD=your-mqtt-password

    # ESP32 Board Endpoint (for direct HTTP requests)
    BOARD_URL=http://your-esp32-board-endpoint:8010

    # Microsoft OAuth2 Configuration (for login with Microsoft account)
    MICROSOFT_CLIENT_ID="your-microsoft-client-id"
    MICROSOFT_CLIENT_SECRET="your-microsoft-client-secret"
    MICROSOFT_CALLBACK_URL="http://localhost:3001/auth"
    # MICROSOFT_CALLBACK_URL="https://your-production-url/auth"
    MICROSOFT_AUTH_URL="https://login.microsoftonline.com/your-tenant-id/oauth2/v2.0/authorize"
    MICROSOFT_TOKEN_URL="https://login.microsoftonline.com/your-tenant-id/oauth2/v2.0/token"

    # Database (MySQL connection)
    # mysql://username:password@host:port/db
    DATABASE_URL="mysql://your-db-username:your-db-password@your-db-host:3306/your-db-name"

    # JWT (for user session tokens)
    JWT_SECRET="your-jwt-secret"
   ```

4. For development:
   ```bash
   npm run dev
   ```

### 3. Database Setup

The project uses Docker Compose for database setup. Make sure Docker is running on your system.

1. The database schema is located in `database/create_table.sql`
2. Mockup data for testing is available in `database/insert_data.sql`

To initialize the database with schema and test data:

```bash
# After starting the database container
docker exec -i your_database_container mysql -u your_username -p your_database < database/create_table.sql
docker exec -i your_database_container mysql -u your_username -p your_database < database/insert_data.sql
```

### 4. Running the Complete Project

1. From the root directory, start all services using Docker Compose:
   ```bash
   docker-compose up -d
   ```

This will start:
- Frontend server (Nginx) on port 80/443
- Backend server on port 3000
- Database service

## Development Workflow

1. Start the backend server in development mode
2. Start the frontend development server
3. Make changes to the code
4. The development servers will automatically reload with your changes

## Production Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start all services using Docker Compose:
   ```bash
   docker-compose up -d
   ```

## Accessing the Application

- Frontend: http://localhost (or https://localhost for HTTPS)
- Backend API: http://localhost:3000

## Additional Information

- The frontend is served using Nginx
- The backend is a Node.js application
- Database configuration is managed through Docker Compose
- Environment variables should be properly configured in both frontend and backend `.env` files
- The project includes a complete database schema and mockup data for testing
- Prisma is used for database operations and type safety
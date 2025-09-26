# Parking Reservation System

A full-stack web application for managing parking reservations built with React, Node.js, Express, and SQLite.
Overview
This application provides a complete parking reservation management system with the following features:

Frontend: React-based user interface for creating, viewing, editing, and deleting parking reservations
Backend: RESTful API built with Node.js and Express for handling reservation operations
Database: SQLite database for persistent data storage
Containerization: Docker and Docker Compose for consistent deployment
CI/CD Pipeline: Automated testing and deployment pipeline
Kubernetes: Container orchestration manifests for production deployment

Prerequisites
Before running this project, make sure you have the following installed on your local machine:

Node.js (version 18 or higher)
Git (latest version)
Docker Desktop (latest version)
npm (comes with Node.js)

Setup Instructions
1. Clone the Repository
git clone <repository-url>
cd ParkingReservationSystem
2. Install Dependencies
Backend:
cd backend
npm install
cd ..
Frontend:
cd frontend
npm install
cd ..
3. Running with Docker (Recommended)
bash# Start all services
docker-compose up --build

If running in background
docker-compose up -d --build
The application will be available at:

Frontend: http://localhost:3000
Backend API: http://localhost:5000/api/reservations

4. Running Manually (Development)
Terminal 1 - Backend:
cd backend
npm run dev
Terminal 2 - Frontend:
cd frontend
npm start
5. Running the CI/CD Pipeline
bash# Windows PowerShell
.\scripts\simple-ci.ps1

If using bash
./scripts/simple-ci.sh
API Endpoints

GET /api/reservations - Get all reservations
GET /api/reservations/:id - Get reservation by ID
POST /api/reservations - Create new reservation
PUT /api/reservations/:id - Update reservation
DELETE /api/reservations/:id - Delete reservation

Business Rules and Validation

License Plate Length: Must be between 2-8 characters
Unique Spot Booking: Same parking spot cannot be booked twice for the same date
Unique License Plate: Same license plate cannot book multiple spots on the same date
Required Fields: Name, license plate, spot number, and date are all required

Technology Stack

Frontend: React 18, Axios, CSS3
Backend: Node.js, Express.js, SQLite
Database: SQLite3 with persistent storage
Containerization: Docker, Docker Compose
CI/CD: PowerShell/Bash scripts with automated testing
Orchestration: Kubernetes (manifests provided)

Key Decisions and Assumptions
Database Choice

SQLite was chosen for simplicity and ease of deployment
Suitable for demonstration purposes and moderate load
Data persists in Docker volumes

Architecture Decisions

RESTful API design following HTTP conventions
Separation of concerns with controllers, routes, and database layers
Error handling with appropriate HTTP status codes
Input validation both client-side and server-side

UI/UX Decisions

Single-page application for better user experience
Real-time form validation with immediate feedback
Responsive design for mobile and desktop compatibility
Edit-in-place functionality for better workflow

Deployment Strategy

Container-first approach using Docker for consistency
Multi-stage pipeline with linting, testing, and integration tests
Production-ready Kubernetes manifests for scalability

Stopping the Application
bash# Stop Docker containers
docker-compose down

Stop manual processes
Ctrl+C in each terminal running the services
Development Notes

The frontend proxy is configured to route API calls to the backend
Hot reloading is enabled for both frontend and backend during development
Database files are stored in Docker volumes for persistence
ESLint is configured for code quality standards

Future Enhancements

User authentication and authorization
Email notifications for reservations
Payment integration
Advanced reporting and analytics
Mobile application
Multi-tenant support

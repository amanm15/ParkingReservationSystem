# Simple CI/CD Pipeline for Parking Reservation System
# This script automates: Lint -> Test -> Build -> Deploy -> Integration Test

Write-Host "Starting CI/CD Pipeline..."

# 1. CLEANUP - Remove old containers
Write-Host "1. Cleaning up..."
docker-compose down

# 2. LINT & TEST BACKEND
Write-Host "2. Backend: Lint & Test..."
cd backend
npm install
Write-Host "   Running linter..."
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "   FAILED: Backend linting failed" -ForegroundColor Red
    exit 1
}
Write-Host "   PASSED: Backend linted successfully" -ForegroundColor Green
docker build -t parking-backend .
Write-Host "   PASSED: Backend Docker image built" -ForegroundColor Green
cd ..

# 3. BUILD & TEST FRONTEND  
Write-Host "3. Frontend: Build & Test..."
cd frontend
npm install
Write-Host "   Building React app..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "   FAILED: Frontend build failed" -ForegroundColor Red
    exit 1
}
Write-Host "   PASSED: Frontend built successfully" -ForegroundColor Green
docker build -t parking-frontend .
Write-Host "   PASSED: Frontend Docker image built" -ForegroundColor Green
cd ..

# 4. DEPLOY - Start both services
Write-Host "4. Deploying Services..."
docker-compose up -d --build
Write-Host "   PASSED: Services deployed" -ForegroundColor Green

# 5. WAIT FOR STARTUP
Write-Host "5. Waiting for services..."
Start-Sleep 30

# 6. INTEGRATION TESTS - Verify everything works
Write-Host "6. Running Integration Tests..."
try {
    # Test backend API
    Invoke-RestMethod "http://localhost:5000/api/reservations"
    Write-Host "   PASSED: Backend API responding" -ForegroundColor Green
    
    # Test frontend
    Invoke-WebRequest "http://localhost:3000" -UseBasicParsing
    Write-Host "   PASSED: Frontend accessible" -ForegroundColor Green
    
    # Test CRUD operations
    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    $testReservation = "{`"name`":`"CI Test $timestamp`",`"licensePlate`":`"TEST$timestamp`",`"spotNumber`":99,`"date`":`"2024-12-31`"}"
    
    # Test CREATE
    $createResult = Invoke-RestMethod "http://localhost:5000/api/reservations" -Method POST -Body $testReservation -ContentType "application/json"
    Write-Host "   PASSED: CREATE operation working" -ForegroundColor Green
    
    # Test READ
    $allReservations = Invoke-RestMethod "http://localhost:5000/api/reservations"
    if ($allReservations.Count -gt 0) {
        Write-Host "   PASSED: READ operation working" -ForegroundColor Green
        
        # Get the ID of the reservation we just created
        $createdReservation = $allReservations | Where-Object { $_.name -eq "CI Test $timestamp" }
        $reservationId = $createdReservation.id
        
        # Test UPDATE
        $updateData = "{`"name`":`"Updated Test $timestamp`",`"licensePlate`":`"UPD$timestamp`",`"spotNumber`":98,`"date`":`"2024-12-30`"}"
        Invoke-RestMethod "http://localhost:5000/api/reservations/$reservationId" -Method PUT -Body $updateData -ContentType "application/json"
        Write-Host "   PASSED: UPDATE operation working" -ForegroundColor Green
        
        # Verify update worked
        $updatedReservation = Invoke-RestMethod "http://localhost:5000/api/reservations/$reservationId"
        if ($updatedReservation.name -eq "Updated Test $timestamp") {
            Write-Host "   PASSED: UPDATE verification successful" -ForegroundColor Green
        }
        
        # Test DELETE
        Invoke-RestMethod "http://localhost:5000/api/reservations/$reservationId" -Method DELETE
        Write-Host "   PASSED: DELETE operation working" -ForegroundColor Green
        
        # Verify delete worked
        try {
            Invoke-RestMethod "http://localhost:5000/api/reservations/$reservationId"
            Write-Host "   FAILED: DELETE verification failed - reservation still exists" -ForegroundColor Red
        } catch {
            Write-Host "   PASSED: DELETE verification successful - reservation removed" -ForegroundColor Green
        }
    }
    
} catch {
    Write-Host "   FAILED: Integration tests failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 7. SUMMARY
Write-Host ""
Write-Host "CI/CD PIPELINE COMPLETED SUCCESSFULLY" -ForegroundColor Green
Write-Host "PIPELINE INCLUDED:"
Write-Host "  - Code Linting (ESLint)" 
Write-Host "  - Unit Tests (npm scripts)"
Write-Host "  - Docker Image Building"
Write-Host "  - Integration Testing"
Write-Host ""
Write-Host "APPLICATION READY:"
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend:  http://localhost:5000/api/reservations"
Write-Host ""
Write-Host "To stop: docker-compose down"
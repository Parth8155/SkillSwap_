# Test Connection Script for PowerShell
Write-Host "Testing Frontend and Backend Connection..." -ForegroundColor Yellow

# Test Backend Health
Write-Host "Testing Backend Health..." -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET
    Write-Host "Backend Status: $($response.status)" -ForegroundColor Green
    Write-Host "Backend Message: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "Backend not responding: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Frontend
Write-Host "Testing Frontend..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET
    if ($response.StatusCode -eq 200) {
        Write-Host "Frontend Status: OK (Status Code: $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "Frontend Status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Frontend not responding: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Connection test completed!" -ForegroundColor Green

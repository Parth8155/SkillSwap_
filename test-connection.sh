#!/bin/bash

# Test Connection Script
echo "🔍 Testing Frontend and Backend Connection..."

# Test Backend Health
echo "📡 Testing Backend Health..."
curl -X GET http://localhost:5000/api/health 2>/dev/null | grep -o '"message":"[^"]*"' || echo "❌ Backend not responding"

# Test Frontend
echo "🌐 Testing Frontend..."
curl -X GET http://localhost:5173 2>/dev/null | grep -o "<title>[^<]*</title>" || echo "❌ Frontend not responding"

echo "✅ Connection test completed!"

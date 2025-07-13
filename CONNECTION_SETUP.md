# Frontend-Backend Connection Setup

This guide explains how to connect the frontend (React + Vite) with the backend (Node.js + Express) in this SkillSwap project.

## 🚀 Quick Start

### Option 1: Run Both Servers Together
```bash
npm run dev:both
```

### Option 2: Run Servers Separately

#### Backend Server (Port 5000)
```bash
cd server
npm install
npm run dev
```

#### Frontend Server (Port 5173)
```bash
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=SkillSwap
VITE_APP_VERSION=1.0.0
```

#### Backend (server/.env)
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your-super-secret-jwt-key-here
```

## 🔗 API Endpoints

### Health Check
- **URL**: `http://localhost:5000/api/health`
- **Method**: GET
- **Response**: JSON with server status

### Authentication
- **Login**: `POST /api/auth/login`
- **Register**: `POST /api/auth/register`
- **Get Profile**: `GET /api/auth/me`

### Skills
- **Get Skills**: `GET /api/skills`
- **Create Skill**: `POST /api/skills`
- **Update Skill**: `PUT /api/skills/:id`
- **Delete Skill**: `DELETE /api/skills/:id`

## 🧪 Testing Connection

### PowerShell Script
```powershell
.\test-connection.ps1
```

### Manual Testing
1. Backend: `curl http://localhost:5000/api/health`
2. Frontend: Open `http://localhost:5173` in browser

## 📡 Socket.IO Setup

The application uses Socket.IO for real-time communication:
- **Server**: `http://localhost:5000`
- **Client**: Connects automatically when authenticated

## 🔒 CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:5173` (Frontend dev server)
- `http://localhost:3000` (Alternative frontend port)

## 📁 Project Structure

```
project/
├── src/                 # Frontend source
│   ├── components/     # React components
│   ├── config/         # API and environment config
│   ├── hooks/          # Custom React hooks
│   └── services/       # API services
├── server/             # Backend source
│   ├── src/
│   │   ├── routes/     # API routes
│   │   ├── models/     # Database models
│   │   └── middleware/ # Express middleware
│   └── .env           # Backend environment
└── .env               # Frontend environment
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Backend: Change `PORT` in `server/.env`
   - Frontend: Change port in `vite.config.ts`

2. **CORS Errors**
   - Check `CLIENT_URL` in `server/.env`
   - Verify frontend URL in server's CORS config

3. **API Not Found**
   - Verify `VITE_API_BASE_URL` in `.env`
   - Check backend server is running on correct port

4. **Database Connection**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `server/.env`

## 🎯 Next Steps

1. Set up authentication with JWT tokens
2. Implement real API endpoints
3. Add proper error handling
4. Set up production deployment
5. Add API documentation with Swagger

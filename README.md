# SkillSwap - Full Stack Application

A modern skill-sharing platform where users can exchange knowledge and skills with each other.

## 🚀 Quick Start

### Option 1: Run Both Frontend & Backend Together
```bash
npm run dev:both
```

### Option 2: Run Separately
```bash
# Terminal 1 - Frontend (React + Vite)
npm run dev

# Terminal 2 - Backend (Node.js + Express)
cd server
npm run dev
```

## 📁 Project Structure

```
project/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── config/            # Configuration files
│   └── context/           # React context providers
├── server/                # Backend Node.js application
│   ├── src/               # Backend source code
│   │   ├── routes/        # API routes
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Express middleware
│   │   └── config/        # Backend configuration
│   └── package.json       # Backend dependencies
└── package.json           # Frontend dependencies & scripts
```

## 🛠️ Available Scripts

### Frontend & Backend Combined
- `npm run dev:both` - Run both frontend and backend concurrently
- `npm run build` - Build both frontend and backend for production

### Frontend Only
- `npm run dev:client` - Start frontend development server
- `npm run build:client` - Build frontend for production
- `npm run preview` - Preview production build

### Backend Only
- `npm run dev:server` - Start backend development server
- `npm run build:server` - Build backend for production
- `npm run start:server` - Start production backend server

### Setup
- `npm run install:server` - Install backend dependencies

## 🌐 Access URLs

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=SkillSwap
VITE_APP_VERSION=1.0.0
```

### Backend (server/.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5174
```

## 🗄️ Database Setup

The application uses MongoDB. Make sure MongoDB is installed and running:

```bash
# Start MongoDB service
mongod
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start:server
```

## 📚 Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.IO** - Real-time communication

## 🎯 Features

- ✅ User authentication (register/login)
- ✅ Real-time messaging
- ✅ Skill management
- ✅ Skill swap requests
- ✅ User profiles
- ✅ Modern responsive UI
- ✅ Socket.IO integration

## 🧪 Testing Connection

The dashboard includes a connection test component to verify backend connectivity. Click the "Test Connection" button to ensure the frontend can communicate with the backend.

## 🔄 Development Workflow

1. Start both servers: `npm run dev:both`
2. Open http://localhost:5174 in your browser
3. Register a new account or login with existing credentials
4. Test the connection using the dashboard test component
5. Start building features!

## 📝 Notes

- The backend server automatically restarts on file changes (nodemon)
- The frontend server supports hot module replacement (HMR)
- Both servers support TypeScript out of the box
- CORS is configured to allow frontend-backend communication

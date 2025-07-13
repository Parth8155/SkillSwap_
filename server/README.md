# SkillSwap Backend API

A comprehensive backend API for the SkillSwap application built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- User registration and login
- Password hashing with bcrypt
- Protected routes with middleware
- Token refresh mechanism

### 👥 User Management
- User profiles with skills and preferences
- User status (online/offline/away/busy)
- Profile picture upload
- Location-based filtering
- Rating system

### 🎯 Skills Management
- Create, read, update, delete skills
- Skill categorization (Design, Programming, etc.)
- Skill levels (Beginner, Intermediate, Advanced, Expert)
- Skill search and filtering
- Tag-based organization

### 🔄 Skill Swapping
- Create skill swap requests
- Accept/decline swap requests
- Swap status tracking
- Session scheduling
- Rating and feedback system

### 💬 Real-time Messaging
- WebSocket-based real-time chat
- Private messaging between users
- Message history
- Typing indicators
- Message read status

### 🔔 Notifications
- Real-time notifications
- Push notifications for important events
- Notification history
- Customizable notification preferences

### 📊 Analytics & Achievements
- User achievement system
- Skill swap statistics
- User activity tracking
- Performance metrics

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **Validation**: Joi
- **Security**: Helmet, CORS, bcrypt
- **File Upload**: Multer, Cloudinary
- **Email**: Nodemailer
- **Rate Limiting**: Express Rate Limit

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd skillswap-backend
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_FROM=noreply@skillswap.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Client URL
CLIENT_URL=http://localhost:5173
```

### 4. Database Setup
Make sure MongoDB is running on your system or provide a cloud MongoDB URI.

### 5. Run the application

#### Development
```bash
npm run dev
# or
yarn dev
```

#### Production
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "Web Developer",
  "location": "San Francisco, CA"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout User
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Skills Endpoints

#### Get All Skills
```http
GET /api/skills?q=javascript&category=Programming&level=Advanced&page=1&limit=10
Authorization: Bearer <token>
```

#### Get My Skills
```http
GET /api/skills/my-skills?type=offered
Authorization: Bearer <token>
```

#### Create Skill
```http
POST /api/skills
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "React Development",
  "category": "Programming",
  "level": "Advanced",
  "description": "Building modern web applications with React",
  "tags": ["React", "JavaScript", "Frontend"],
  "type": "offered"
}
```

#### Update Skill
```http
PUT /api/skills/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Advanced React Development",
  "level": "Expert"
}
```

#### Delete Skill
```http
DELETE /api/skills/:id
Authorization: Bearer <token>
```

### Response Format

All API responses follow this structure:
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalItems": 50
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## 🔒 Security Features

- **Helmet**: Sets various HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: Joi schema validation
- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Environment Variables**: Sensitive data protection

## 🌐 WebSocket Events

### Client to Server
- `typing` - User is typing
- `sendMessage` - Send a message
- `updateStatus` - Update user status

### Server to Client
- `messageReceived` - New message received
- `userTyping` - User typing indicator
- `userStatusUpdate` - User status changed

## 📁 Project Structure

```
src/
├── config/
│   └── database.ts          # Database configuration
├── middleware/
│   ├── auth.ts              # Authentication middleware
│   ├── errorHandler.ts      # Error handling
│   └── notFound.ts          # 404 handler
├── models/
│   ├── User.ts              # User model
│   ├── Skill.ts             # Skill model
│   ├── SkillSwap.ts         # Skill swap model
│   ├── Message.ts           # Message model
│   └── Conversation.ts      # Conversation model
├── routes/
│   ├── auth.ts              # Authentication routes
│   ├── users.ts             # User routes
│   ├── skills.ts            # Skill routes
│   ├── swaps.ts             # Swap routes
│   ├── messages.ts          # Message routes
│   └── notifications.ts     # Notification routes
├── socket/
│   └── socketHandlers.ts    # WebSocket handlers
├── types/
│   └── index.ts             # TypeScript types
└── server.ts                # Main server file
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/skillswap
JWT_SECRET=your-production-secret
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@skillswap.com or join our Discord community.

## 🔄 Changelog

### v1.0.0
- Initial release with core functionality
- User authentication and authorization
- Skills management
- Real-time messaging
- Basic swap functionality

---

**Happy Coding! 🚀**

#!/bin/bash

# SkillSwap Backend Setup Script

echo "🚀 Setting up SkillSwap Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null
then
    echo "⚠️  MongoDB is not installed. Please install MongoDB first."
    echo "📖 Visit: https://docs.mongodb.com/manual/installation/"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Create uploads directory
mkdir -p uploads

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your configuration."
else
    echo "⚠️  .env file already exists."
fi

echo "🎉 Backend setup completed!"
echo ""
echo "📝 Next steps:"
echo "1. Update your .env file with your configuration"
echo "2. Make sure MongoDB is running"
echo "3. Run: npm run dev"
echo ""
echo "🔗 API will be available at: http://localhost:5000"
echo "🩺 Health check: http://localhost:5000/health"

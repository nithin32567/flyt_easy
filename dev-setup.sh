#!/bin/bash

echo "🔧 Setting up development environment..."

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

echo "✅ Development setup complete!"
echo ""
echo "To start development:"
echo "1. Terminal 1: cd server && npm run dev"
echo "2. Terminal 2: cd client && npm run dev"
echo ""
echo "The React app will be available at: http://localhost:5173"
echo "The API server will be available at: http://localhost:3000" 
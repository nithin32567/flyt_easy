#!/bin/bash

echo "🚀 Starting deployment process..."

# Build the React application
echo "📦 Building React application..."
cd client
npm run build
cd ..

# Copy the built files to server
echo "📋 Copying built files to server..."
cp -r client/dist server/

# Install server dependencies
echo "📥 Installing server dependencies..."
cd server
npm install

# Start the server
echo "🔄 Starting server..."
npm start 
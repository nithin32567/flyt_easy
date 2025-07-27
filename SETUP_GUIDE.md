# FlytEasy Setup Guide

## 🚀 Quick Start

### Local Development Setup

1. **Install dependencies:**
   ```bash
   ./dev-setup.sh
   ```

2. **Start the development servers:**
   ```bash
   # Terminal 1 - Start backend server
   cd server && npm run dev
   
   # Terminal 2 - Start frontend development server
   cd client && npm run dev
   ```

3. **Access your application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### VPS Deployment

1. **Build and deploy:**
   ```bash
   ./deploy.sh
   ```

2. **Access your application:**
   - Production URL: http://147.93.18.244:3000

## 🔧 Configuration Details

### CORS Configuration

The server is configured with CORS to allow requests from:
- Local development: `http://localhost:5173`, `http://localhost:3000`, `http://localhost:4173`
- VPS production: `http://147.93.18.244`, `https://147.93.18.244`

### Environment Variables

#### Client (.env.local)
```env
VITE_BASE_URL=http://localhost:3000
```

#### Server (.env)
```env
PORT=3000
NODE_ENV=production
```

## 📁 Project Structure

```
flyt_easy/
├── client/                 # React frontend
│   ├── src/
│   ├── dist/              # Built files (generated)
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── server.js
├── deploy.sh              # Production deployment script
├── dev-setup.sh           # Development setup script
└── SETUP_GUIDE.md         # This file
```

## 🔄 Development Workflow

### Frontend Development
- Uses Vite for fast development
- Proxy configuration routes `/api` calls to backend
- Hot module replacement enabled

### Backend Development
- Express.js server with CORS enabled
- MongoDB connection (configure in `config/db.js`)
- API routes in `/api` prefix

## 🚀 Production Deployment

### Using PM2 (Recommended)

1. **Install PM2 globally:**
   ```bash
   npm install -g pm2
   ```

2. **Deploy to VPS:**
   ```bash
   ./deploy.sh
   ```

3. **Start with PM2:**
   ```bash
   cd server
   pm2 start server.js --name "flyt_easy_mern"
   ```

4. **PM2 Commands:**
   ```bash
   pm2 list                    # View all processes
   pm2 restart flyt_easy_mern  # Restart application
   pm2 stop flyt_easy_mern     # Stop application
   pm2 logs flyt_easy_mern     # View logs
   ```

### Manual Deployment

1. **Build frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Copy to server:**
   ```bash
   cp -r dist ../server/
   ```

3. **Start server:**
   ```bash
   cd server
   npm start
   ```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure the origin is added to CORS configuration in `server.js`
   - Check that the frontend is making requests to the correct backend URL

2. **Port Already in Use:**
   - Change the PORT in server.js or use `process.env.PORT`
   - Kill existing processes: `lsof -ti:3000 | xargs kill -9`

3. **Build Errors:**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for missing dependencies in package.json

### Logs and Debugging

- **Server logs:** Check console output or PM2 logs
- **Client logs:** Check browser developer tools
- **Network requests:** Use browser Network tab to debug API calls

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs for error messages
3. Verify CORS configuration matches your deployment URLs 
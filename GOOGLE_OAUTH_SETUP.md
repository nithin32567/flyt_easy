# Google OAuth Setup Guide

## Issues Fixed

### 1. CORS Configuration ✅
- Updated server CORS settings to allow localhost origins
- Added proper headers and methods
- Added better error logging

### 2. Error Handling ✅
- Enhanced GoogleLoginButton with better error handling
- Added detailed logging in login controller
- Improved user feedback

### 3. Environment Configuration ✅
- Updated server configuration with fallback values
- Enhanced client-side error handling

## Required Google OAuth Configuration

### Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"

### Step 2: Configure OAuth Client

**Application Type:** Web application

**Authorized JavaScript origins:**
```
http://localhost:5173
http://localhost:3000
http://127.0.0.1:5173
http://127.0.0.1:3000
```

**Authorized redirect URIs:**
```
http://localhost:5173
http://localhost:3000
```

### Step 3: Environment Variables

Create these environment files:

**Server (.env):**
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your_secure_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

**Client (.env):**
```env
VITE_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Step 4: Test the Setup

1. Start the server: `cd server && npm start`
2. Start the client: `cd client && npm run dev`
3. Navigate to `http://localhost:5173`
4. Try the Google login button

## Troubleshooting

### Common Issues:

1. **"The given origin is not allowed"**
   - Add your localhost URLs to Google OAuth authorized origins
   - Check that the client ID matches in both client and server

2. **401 Unauthorized**
   - Verify GOOGLE_CLIENT_ID is set correctly
   - Check server logs for detailed error messages
   - Ensure JWT_SECRET is set

3. **CORS Errors**
   - Verify server CORS configuration includes your client URL
   - Check browser network tab for CORS preflight requests

4. **Network Errors**
   - Ensure server is running on port 3000
   - Check VITE_BASE_URL matches your server URL

## Current Configuration Status

✅ CORS properly configured
✅ Error handling enhanced
✅ Logging improved
✅ Client-side error handling added

⚠️ **Still Required:**
- Set up Google OAuth client in Google Cloud Console
- Add environment variables
- Test the complete flow

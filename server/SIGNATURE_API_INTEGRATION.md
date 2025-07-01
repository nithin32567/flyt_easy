# Signature API Integration Guide

## Overview

The FlytEasy application uses a JWT (JSON Web Token) based authentication system. The Signature API generates a JWT token that is valid for 48 hours and must be included in all subsequent API requests.

## API Endpoint

**URL:** `{UtilsURL}/Utils/Signature`  
**Method:** `POST`  
**Content-Type:** `application/json`

## Request Body

```json
{
   "MerchantID": "300",
   "ApiKey": "************",
   "ClientID": "*******",
   "Password": "********",
   "AgentCode": "",
   "BrowserKey": "ef20-925c-4489-bfeb-236c8b406f7e"
}
```

## Response

```json
{
   "TUI": "af80de34-fccb-4c28-9365-6740b775265b|4913ba1b-4ecd-4909-9c1e-e1a47161c31c|20200625105832",
   "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   "ClientID": "fdsfsa764756787jhj/547ghjkg7nmnm=",
   "LastLoginDate": "6/25/2020 10:41:30 AM",
   "Password": "6juhjghfj567735hjf==",
   "loginAttempts": "0",
   "Code": "200",
   "Msg": ["Success"]
}
```

## Implementation Details

### 1. Login Flow

1. User enters Client ID and Password on the login page
2. Frontend calls `/api/signature` endpoint
3. Backend validates credentials and calls external Signature API
4. JWT token is returned and stored in localStorage
5. User is redirected to the main application

### 2. Token Management

The application includes a `TokenManager` utility class that handles:

- **Token Storage:** Automatically stores token with timestamp
- **Expiry Tracking:** Monitors 48-hour expiry period
- **Auto-refresh:** Warns users 2 hours before expiry
- **Authentication:** Provides helper methods for API requests

### 3. Using the Token

#### In Frontend JavaScript:

```javascript
// Include the TokenManager
<script src="./assets/js/tokenManager.js"></script>

// Check if user is authenticated
if (tokenManager.isAuthenticated()) {
    // User has valid token
}

// Make authenticated API request
try {
    const response = await tokenManager.authenticatedRequest('/api/some-endpoint', {
        method: 'POST',
        body: JSON.stringify(data)
    });
} catch (error) {
    // Handle authentication errors
}
```

#### In Backend API Calls:

```javascript
// Include token in headers
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
});
```

### 4. Token Expiry Handling

- **48-hour validity:** Tokens expire after 48 hours
- **Warning system:** Users are warned 2 hours before expiry
- **Auto-logout:** Expired tokens automatically redirect to login
- **Background monitoring:** Token status checked every 5 minutes

## Security Features

### 1. Token Storage
- Tokens are stored in localStorage with timestamps
- Automatic cleanup of expired tokens
- Secure token validation

### 2. Request Protection
- All API requests include Authorization header
- Automatic 401 handling with logout
- Token validation on every request

### 3. Session Management
- Automatic session expiry handling
- Graceful logout on token expiration
- User-friendly expiry warnings

## Error Handling

### Common Error Scenarios:

1. **Invalid Credentials**
   ```json
   {
     "success": false,
     "message": "Client ID or password is incorrect"
   }
   ```

2. **Token Expired**
   ```json
   {
     "success": false,
     "message": "Session expired. Please log in again."
   }
   ```

3. **Network Errors**
   - Automatic retry mechanisms
   - User-friendly error messages
   - Fallback to login page

## Best Practices

### 1. Token Usage
- Always use `tokenManager.authenticatedRequest()` for API calls
- Never store tokens in plain text
- Clear tokens on logout

### 2. Error Handling
- Handle 401 responses gracefully
- Provide clear error messages to users
- Log authentication failures for debugging

### 3. Security
- Validate tokens on every request
- Implement proper logout functionality
- Monitor for suspicious activity

## Integration Examples

### Frontend Integration

```javascript
// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!tokenManager.requireAuth()) {
        return; // Will redirect to login
    }
    
    // Continue with authenticated functionality
    loadUserData();
});

// Make API calls
async function loadUserData() {
    try {
        const response = await tokenManager.authenticatedRequest('/api/user/profile');
        const userData = await response.json();
        displayUserData(userData);
    } catch (error) {
        console.error('Failed to load user data:', error);
    }
}
```

### Backend Integration

```javascript
// Middleware to validate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access token required' 
        });
    }
    
    // Validate token and attach user info to request
    // ... token validation logic
    
    next();
};

// Protected route
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ success: true, data: 'Protected data' });
});
```

## Troubleshooting

### Common Issues:

1. **Token Not Found**
   - Check if user is logged in
   - Verify localStorage has token
   - Clear localStorage and re-login

2. **401 Unauthorized**
   - Token may be expired
   - Check token format in headers
   - Verify backend token validation

3. **Network Errors**
   - Check API endpoint availability
   - Verify CORS configuration
   - Check network connectivity

### Debug Information:

```javascript
// Check token status
console.log('Token:', tokenManager.getToken());
console.log('Is Authenticated:', tokenManager.isAuthenticated());
console.log('Token Age (hours):', tokenManager.getTokenAge());
console.log('Remaining Hours:', tokenManager.getRemainingHours());
```

## Support

For issues with the Signature API integration:

1. Check browser console for error messages
2. Verify API endpoint configuration
3. Test with valid credentials
4. Contact development team with error logs 
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function GoogleLoginButton() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSuccess = async (credentialResponse) => {
    try {
      console.log("Google login successful, sending token to server...");
      
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
      console.log("Base URL:", baseUrl);
      
      const res = await axios.post(`${baseUrl}/api/login/google-login`, {
        token: credentialResponse.credential,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      
      console.log("Server response:", res.data);
      
      // Update auth context with user data
      login(res.data.user);
      
      // Redirect to the intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      
      alert("Login Success ✅");
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response?.status === 401) {
        errorMessage = "Authentication failed. Please try again.";
      } else if (err.response?.status === 400) {
        errorMessage = "Invalid request. Please try again.";
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = "Network error. Please check your connection.";
      }
      
      alert(`❌ ${errorMessage}`);
    }
  };

  const handleError = (error) => {
    console.error("Google OAuth error:", error);
    alert("❌ Google login failed. Please try again.");
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      useOneTap={false}
      auto_select={false}
      theme="outline"
      size="large"
      text="signin_with"
      shape="rectangular"
    />
  );
}

import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // console.log('User already authenticated, redirecting...');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Handle regular email/password login logic here
      // console.log('Login attempt with:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add your authentication logic here
      
    } catch (error) {
      // console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSubmitLogin = async () => {
    setIsLoading(true);
    
    try {
      const response =await axios.get(`${import.meta.env.VITE_BASE_URL}/api/login/google-login`,
        {
          withCredentials: true,
        }
      )
      
    } catch (error) {
      // console.error('Google login error:', error);
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#16437c] to-[#f3f7fccb] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#16437c] to-[#f3f7fccb] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-yellow-500">
    <div className='flex flex-col items-center justify-center rounded-xl p-4'>
     <span className='text-2xl font-bold text-white'>Welcome back</span>
     <span className='text-sm text-white'>Sign in to your account to continue</span>
    </div>
        {/* Login Form */}
        <div className="bg-white rounded-xl  p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#16437c]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}   
                    className="block w-full text-[#16437c] placeholder:text-[#16437c] pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16437c] focus:border-transparent transition duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#16437c]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full text-[#16437c] placeholder:text-[#16437c] pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16437c] focus:border-transparent transition duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute register-btn inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#16437c] hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#16437c] hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                    className="h-4 w-4 text-[var(--PrimaryColor)] focus:ring-[var(--PrimaryColor)] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to='/forgot-password' className="font-medium text-[var(--PrimaryColor)] hover:text-[var(--PrimaryColor)] transition duration-200">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group register-btn relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[var(--YellowColor)] register-btn hover:bg-[var(--PrimaryColor)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--PrimaryColor)] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isLoading ? (
                <div className="flex items-center ">
                  <div className="animat bg-[var(--PrimaryColor)] rounded-full h-4 w-4 border-b-2 border-[var(--PrimaryColor)] mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <Link to='/login' className="text-white">Sign in</Link>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Google Sign In Button */}
          <div className="mt-6">
            {/* <button
              type="button"
              onClick={handleGoogleSubmitLogin}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button> */}
            <GoogleLoginButton />
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
                <Link to='/login' className="font-medium text-[var(--PrimaryColor)] hover:text-[var(--PrimaryColor)] transition duration-200">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
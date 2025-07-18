import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Make actual API call to login
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Set the token in context and localStorage
      login(data.token);
      
      console.log('Login successful!');
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      // Handle different types of errors
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to server. Please make sure the server is running on port 5000.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and ensure the server is running.');
      } else {
        setError(err.message || 'Login failed!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main card container */}
      <div className="relative w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            {/* <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="text-white text-3xl font-bold">T</div>
            </div> */}
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent mb-2">
            Task Manager
          </h1>
          <p className="text-gray-600 text-lg">Welcome back! Sign in to continue</p>
        </div>

        {/* Login card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300">
          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 text-gray-900 placeholder-gray-500 hover:border-gray-300"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <div className="w-2 h-2 bg-violet-500 rounded-full opacity-50"></div>
                </div>
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 text-gray-900 placeholder-gray-500 hover:border-gray-300 pr-12"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-sm font-medium">
                    {showPassword ? 'Hide' : 'Show'}
                  </span>
                </button>
              </div>
            </div>

            {/* Forgot password link */}
            {/* Sample credentials info */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-3 rounded-md text-sm mb-4">
              <p><strong>Test Account:</strong></p>
              <p>Email: <code>aryan@example.com</code></p>
              <p>Password: <code>aryantest</code></p>
            </div>

            {/* Submit button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="px-4 text-sm text-gray-500 font-medium">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Social login buttons */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-200"
            >
              Continue with Google
            </button>
            <button
              type="button"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500"
            >
              Continue with GitHub
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-violet-600 hover:text-violet-700 font-semibold transition-colors duration-200 hover:underline bg-transparent border-none cursor-pointer"
              onClick={() => navigate('/register')}
            >
              Create one now
            </button>
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>© 2025 Task Manager</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span>Secure & Reliable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
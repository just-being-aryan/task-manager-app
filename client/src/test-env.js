// Test environment variable loading
console.log('=== Environment Variable Test ===');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('NODE_ENV:', import.meta.env.NODE_ENV);
console.log('MODE:', import.meta.env.MODE);
console.log('All env vars:', import.meta.env);
console.log('================================');

export const testEnv = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  console.log('Using API URL:', apiUrl);
  return apiUrl;
};

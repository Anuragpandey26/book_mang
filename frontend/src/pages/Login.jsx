import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login...', { email });
      const { data } = await api.post('/auth/login', { email, password });
      console.log('Login response:', data);
      
      // Store credentials first
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.accessToken);
      
      // Then call login hook
      login(data.user, data.accessToken);
      
      toast.success('Login successful!');
      
      // Small delay to ensure state updates
      setTimeout(() => {
        console.log('Redirecting user with role:', data.user.role);
        if (data.user.role === 'librarian') {
          navigate('/dashboard');
        } else {
          navigate('/member-dashboard');
        }
      }, 100);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Cannot connect to server. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <BookOpen className="w-16 h-16 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Library System</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin@library.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register here
            </Link>
          </p>
          <Link to="/member" className="block text-sm text-blue-600 hover:underline">
            Member? Check your borrowed books →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

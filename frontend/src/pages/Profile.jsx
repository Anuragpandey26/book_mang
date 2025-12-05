import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: ''
      });
      fetchUserDetails();
    }
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      const { data } = await api.get(`/users/${user.id}`);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Failed to fetch user details');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const { data } = await api.put(`/users/${user.id}`, updateData);
      
      // Update user in localStorage
      const updatedUser = { ...user, name: data.name, email: data.email };
      login(updatedUser, localStorage.getItem('accessToken'));
      
      toast.success('Profile updated successfully!');
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {user?.role === 'librarian' && <Navbar />}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center space-x-3 mb-6">
              <UserIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password (Optional)</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      minLength="6"
                      placeholder="Leave blank to keep current password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      minLength="6"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Updating...' : 'Update Profile'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

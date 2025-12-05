import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, LogOut, User as UserIcon, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/helpers';

const MyRequests = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/borrow-requests/my-requests');
      setRequests(data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    if (status === 'pending') return <Clock className="w-4 h-4" />;
    if (status === 'approved') return <CheckCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">Library System</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/member-dashboard" className="text-gray-700 hover:text-blue-600 text-sm">My Books</Link>
              <Link to="/browse-books" className="text-gray-700 hover:text-blue-600 text-sm">Browse Books</Link>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600 text-sm">Profile</Link>
              <div className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center space-x-1 text-red-600 hover:text-red-700">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Borrow Requests</h1>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500">No requests yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Book</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Request Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Reviewed By</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{req.book.title}</p>
                        <p className="text-sm text-gray-500">{req.book.author.name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDate(req.request_date)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(req.status)}`}>
                          {getStatusIcon(req.status)}
                          <span className="capitalize">{req.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {req.reviewer ? req.reviewer.name : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {req.rejection_note ? (
                          <span className="text-red-600">{req.rejection_note}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRequests;

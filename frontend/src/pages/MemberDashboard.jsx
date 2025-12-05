import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { formatDate, calculateFine, isOverdue } from '../utils/helpers';

const MemberDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [borrowed, setBorrowed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBorrowed();
    }
  }, [user]);

  const fetchBorrowed = async () => {
    try {
      const { data } = await api.get(`/users/${user.id}/borrowed`);
      setBorrowed(data);
    } catch (error) {
      toast.error('Failed to fetch borrowed books');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalFine = borrowed.reduce((sum, item) => sum + calculateFine(item.due_date), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">Library System</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/browse-books" className="text-gray-700 hover:text-blue-600 text-sm">Browse Books</Link>
              <Link to="/my-requests" className="text-gray-700 hover:text-blue-600 text-sm">My Requests</Link>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600 text-sm">Profile</Link>
              <div className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Member Info Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user?.name}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Member ID</p>
                <p className="text-2xl font-bold text-blue-600">{user?.id}</p>
                <p className="text-xs text-gray-500 mt-1">Use this ID to check books</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Books Borrowed</p>
                <p className="text-2xl font-bold text-green-600">{borrowed.length}/5</p>
                <p className="text-xs text-gray-500 mt-1">Maximum 5 books allowed</p>
              </div>
              
              <div className={`${totalFine > 0 ? 'bg-red-50' : 'bg-gray-50'} p-4 rounded-lg`}>
                <p className="text-sm text-gray-600 mb-1">Total Fine</p>
                <p className={`text-2xl font-bold ${totalFine > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  ${totalFine.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">$0.50 per day overdue</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Email:</strong> {user?.email || 'Not provided'}
              </p>
            </div>
          </div>

          {/* Borrowed Books */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800">My Borrowed Books</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : borrowed.length === 0 ? (
              <div className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">You have no borrowed books</p>
                <p className="text-gray-400 text-sm mt-2">Visit the library to borrow books</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Book</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Author</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fine</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {borrowed.map((item) => {
                      const fine = calculateFine(item.due_date);
                      const overdue = isOverdue(item.due_date);

                      return (
                        <tr key={item.id} className={overdue ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{item.book.title}</p>
                            <p className="text-sm text-gray-500">{item.book.category || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{item.book.author.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{formatDate(item.issue_date)}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={overdue ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                              {formatDate(item.due_date)}
                            </span>
                            {overdue && (
                              <span className="block text-xs text-red-600 mt-1">OVERDUE!</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {fine > 0 ? (
                              <span className="text-red-600 font-bold">${fine.toFixed(2)}</span>
                            ) : (
                              <span className="text-green-600">$0.00</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {totalFine > 0 && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 font-semibold">
                ⚠️ You have an outstanding fine of ${totalFine.toFixed(2)}
              </p>
              <p className="text-red-600 text-sm mt-1">
                Please pay at the library counter when returning books.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;

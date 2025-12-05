import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">Library System</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <Link to="/books" className="text-gray-700 hover:text-blue-600">Books</Link>
              <Link to="/members" className="text-gray-700 hover:text-blue-600">Members</Link>
              <Link to="/borrow-requests-admin" className="text-gray-700 hover:text-blue-600">Requests</Link>
              <Link to="/borrow" className="text-gray-700 hover:text-blue-600">Issue Book</Link>
              <Link to="/return" className="text-gray-700 hover:text-blue-600">Return</Link>
              <Link to="/overdue" className="text-gray-700 hover:text-blue-600">Overdue</Link>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
              
              <div className="flex items-center space-x-3 border-l pl-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

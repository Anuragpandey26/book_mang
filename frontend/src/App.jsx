import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import IssueBorrow from './pages/IssueBorrow';
import ReturnBook from './pages/ReturnBook';
import Overdue from './pages/Overdue';
import MemberView from './pages/MemberView';
import MemberDashboard from './pages/MemberDashboard';
import BrowseBooks from './pages/BrowseBooks';
import MyRequests from './pages/MyRequests';
import BorrowRequestsAdmin from './pages/BorrowRequestsAdmin';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const LibrarianRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  if (user?.role !== 'librarian') {
    return <Navigate to="/member-dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/member" element={<MemberView />} />
          <Route path="/member-dashboard" element={<PrivateRoute><MemberDashboard /></PrivateRoute>} />
          <Route path="/browse-books" element={<PrivateRoute><BrowseBooks /></PrivateRoute>} />
          <Route path="/my-requests" element={<PrivateRoute><MyRequests /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          
          <Route path="/" element={<LibrarianRoute><><Navbar /><Dashboard /></></LibrarianRoute>} />
          <Route path="/dashboard" element={<LibrarianRoute><><Navbar /><Dashboard /></></LibrarianRoute>} />
          <Route path="/books" element={<LibrarianRoute><><Navbar /><Books /></></LibrarianRoute>} />
          <Route path="/members" element={<LibrarianRoute><><Navbar /><Members /></></LibrarianRoute>} />
          <Route path="/borrow-requests-admin" element={<LibrarianRoute><><Navbar /><BorrowRequestsAdmin /></></LibrarianRoute>} />
          <Route path="/borrow" element={<LibrarianRoute><><Navbar /><IssueBorrow /></></LibrarianRoute>} />
          <Route path="/return" element={<LibrarianRoute><><Navbar /><ReturnBook /></></LibrarianRoute>} />
          <Route path="/overdue" element={<LibrarianRoute><><Navbar /><Overdue /></></LibrarianRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

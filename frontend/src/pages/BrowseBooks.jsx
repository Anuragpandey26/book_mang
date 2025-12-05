import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Search, LogOut, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const BrowseBooks = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [borrowedCount, setBorrowedCount] = useState(0);

  useEffect(() => {
    fetchBooks();
    fetchBorrowedCount();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books?available=true');
      setBooks(data.filter(b => b.available_copies > 0));
    } catch (error) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrowedCount = async () => {
    try {
      const { data } = await api.get(`/users/${user.id}/borrowed`);
      setBorrowedCount(data.length);
    } catch (error) {
      console.error('Failed to fetch borrowed count');
    }
  };

  const handleRequestBorrow = async (bookId, bookTitle) => {
    if (borrowedCount >= 5) {
      toast.error('You have reached the maximum limit of 5 books');
      return;
    }

    if (!confirm(`Send borrow request for "${bookTitle}"?`)) return;

    try {
      await api.post('/borrow-requests', {
        book_id: bookId
      });
      toast.success('Borrow request sent! Wait for librarian approval.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send request');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.name.toLowerCase().includes(search.toLowerCase()) ||
    (book.category && book.category.toLowerCase().includes(search.toLowerCase()))
  );

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
              <Link to="/member-dashboard" className="text-gray-700 hover:text-blue-600 text-sm">My Books</Link>
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Browse Available Books</h1>
            
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title, author, or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-600">Books Borrowed</p>
                <p className="text-2xl font-bold text-blue-600">{borrowedCount}/5</p>
              </div>
            </div>
          </div>

          {/* Books Table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No books available</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Author</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ISBN</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Available</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{book.title}</p>
                        {book.publisher && (
                          <p className="text-sm text-gray-500">{book.publisher}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{book.author.name}</td>
                      <td className="px-6 py-4">
                        {book.category ? (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {book.category}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{book.isbn || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${book.available_copies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {book.available_copies}/{book.total_copies}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRequestBorrow(book.id, book.title)}
                          disabled={borrowedCount >= 5 || book.available_copies === 0}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Request
                        </button>
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

export default BrowseBooks;

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Modal from '../components/Modal';
import Loader from '../components/Loader';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '', author_name: '', isbn: '', category: '', publisher: '', year: '', total_copies: 1, available_copies: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const booksRes = await api.get('/books');
      setBooks(booksRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await api.put(`/books/${editingBook.id}`, formData);
        toast.success('Book updated!');
      } else {
        await api.post('/books', formData);
        toast.success('Book added!');
      }
      setShowModal(false);
      setEditingBook(null);
      setFormData({ title: '', author_name: '', isbn: '', category: '', publisher: '', year: '', total_copies: 1, available_copies: 1 });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      toast.success('Book deleted!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Delete failed');
    }
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author_name: book.author.name,
      isbn: book.isbn || '',
      category: book.category || '',
      publisher: book.publisher || '',
      year: book.year || '',
      total_copies: book.total_copies,
      available_copies: book.available_copies
    });
    setShowModal(true);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Books Management</h1>
        <button
          onClick={() => { setShowModal(true); setEditingBook(null); setFormData({ title: '', author_name: '', isbn: '', category: '', publisher: '', year: '', total_copies: 1, available_copies: 1 }); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Book</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Author</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ISBN</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Available</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td className="px-4 py-3 text-sm font-medium">{book.title}</td>
                <td className="px-4 py-3 text-sm">{book.author.name}</td>
                <td className="px-4 py-3 text-sm">{book.isbn || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">{book.category || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">{book.available_copies}/{book.total_copies}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <button onClick={() => openEditModal(book)} className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingBook ? 'Edit Book' : 'Add New Book'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
            <input type="text" value={formData.author_name} onChange={(e) => setFormData({...formData, author_name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Enter author name" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
              <input type="text" value={formData.isbn} onChange={(e) => setFormData({...formData, isbn: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
              <input type="text" value={formData.publisher} onChange={(e) => setFormData({...formData, publisher: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies *</label>
              <input type="number" min="1" value={formData.total_copies} onChange={(e) => setFormData({...formData, total_copies: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            {editingBook && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Copies *</label>
                <input type="number" min="0" max={formData.total_copies} value={formData.available_copies} onChange={(e) => setFormData({...formData, available_copies: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
            )}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            {editingBook ? 'Update Book' : 'Add Book'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Books;

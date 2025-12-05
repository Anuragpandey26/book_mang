import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Loader from '../components/Loader';

const IssueBorrow = () => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [memberInfo, setMemberInfo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, membersRes] = await Promise.all([
        api.get('/books?available=true'),
        api.get('/users')
      ]);
      setBooks(booksRes.data.filter(b => b.available_copies > 0));
      setMembers(membersRes.data.filter(m => m.role === 'member'));
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberInfo = async (userId) => {
    try {
      const { data } = await api.get(`/users/${userId}/borrowed`);
      setMemberInfo({ borrowed: data.length });
    } catch (error) {
      setMemberInfo(null);
    }
  };

  useEffect(() => {
    if (selectedMember) {
      fetchMemberInfo(selectedMember);
    } else {
      setMemberInfo(null);
    }
  }, [selectedMember]);

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await api.post('/borrow', {
        book_id: parseInt(selectedBook),
        user_id: parseInt(selectedMember)
      });
      toast.success('Book issued successfully!');
      setSelectedBook('');
      setSelectedMember('');
      setMemberInfo(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to issue book');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Issue Book</h1>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleIssue} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Member *</label>
            <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <option value="">Choose a member...</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} (ID: {m.id})</option>
              ))}
            </select>
            {memberInfo && (
              <p className="mt-2 text-sm text-gray-600">
                Currently borrowed: <span className="font-semibold">{memberInfo.borrowed}/5 books</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Book *</label>
            <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <option value="">Choose a book...</option>
              {books.map(b => (
                <option key={b.id} value={b.id}>{b.title} by {b.author.name} ({b.available_copies} available)</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={!selectedBook || !selectedMember} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            Issue Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default IssueBorrow;

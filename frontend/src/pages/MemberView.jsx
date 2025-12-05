import { useState } from 'react';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { formatDate, calculateFine, isOverdue } from '../utils/helpers';

const MemberView = () => {
  const [memberId, setMemberId] = useState('');
  const [member, setMember] = useState(null);
  const [borrowed, setBorrowed] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!memberId) return;

    setLoading(true);
    try {
      const [memberRes, borrowedRes] = await Promise.all([
        api.get(`/users/${memberId}`),
        api.get(`/users/${memberId}/borrowed`)
      ]);
      setMember(memberRes.data);
      setBorrowed(borrowedRes.data);
    } catch (error) {
      toast.error('Member not found');
      setMember(null);
      setBorrowed([]);
    } finally {
      setLoading(false);
    }
  };

  const totalFine = borrowed.reduce((sum, item) => sum + calculateFine(item.due_date), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Member Self-Service</h1>
            
            <form onSubmit={handleSearch} className="flex space-x-4">
              <input
                type="number"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder="Enter your Member ID"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
              >
                <Search className="w-5 h-5" />
                <span>{loading ? 'Searching...' : 'View My Books'}</span>
              </button>
            </form>
          </div>

          {member && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {member.name}!</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Member ID:</span>
                    <span className="ml-2 font-semibold">{member.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Books Borrowed:</span>
                    <span className="ml-2 font-semibold">{borrowed.length}/5</span>
                  </div>
                  {totalFine > 0 && (
                    <div className="col-span-2">
                      <span className="text-gray-600">Total Fine:</span>
                      <span className="ml-2 font-bold text-red-600">${totalFine.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-bold text-gray-800">Currently Borrowed Books</h3>
                </div>

                {borrowed.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-gray-500">You have no borrowed books</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Book</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Author</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fine</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {borrowed.map((item) => {
                        const fine = calculateFine(item.due_date);
                        const overdue = isOverdue(item.due_date);

                        return (
                          <tr key={item.id} className={overdue ? 'bg-red-50' : ''}>
                            <td className="px-4 py-3 text-sm font-medium">{item.book.title}</td>
                            <td className="px-4 py-3 text-sm">{item.book.author.name}</td>
                            <td className="px-4 py-3 text-sm">{formatDate(item.issue_date)}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={overdue ? 'text-red-600 font-semibold' : ''}>
                                {formatDate(item.due_date)}
                                {overdue && <span className="ml-2 text-xs">(OVERDUE)</span>}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {fine > 0 ? (
                                <span className="text-red-600 font-semibold">${fine.toFixed(2)}</span>
                              ) : (
                                <span className="text-green-600">$0.00</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberView;

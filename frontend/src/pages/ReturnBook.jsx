import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Loader from '../components/Loader';
import { formatDate, calculateFine, isOverdue } from '../utils/helpers';

const ReturnBook = () => {
  const [borrowed, setBorrowed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBorrowed();
  }, []);

  const fetchBorrowed = async () => {
    try {
      const { data } = await api.get('/borrowed');
      setBorrowed(data);
    } catch (error) {
      toast.error('Failed to fetch borrowed books');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    try {
      const { data } = await api.post(`/return/${id}`);
      toast.success(data.message);
      if (data.transaction.fine_amount > 0) {
        toast(`Fine: $${data.transaction.fine_amount}`, { icon: '💰' });
      }
      fetchBorrowed();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Return failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Return Books</h1>

      {borrowed.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No books currently borrowed</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Book</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Member</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fine</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {borrowed.map((item) => {
                const fine = calculateFine(item.due_date);
                const overdue = isOverdue(item.due_date);
                
                return (
                  <tr key={item.id} className={overdue ? 'bg-red-50' : ''}>
                    <td className="px-4 py-3 text-sm font-medium">{item.book.title}</td>
                    <td className="px-4 py-3 text-sm">{item.member.name}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(item.issue_date)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={overdue ? 'text-red-600 font-semibold' : ''}>
                        {formatDate(item.due_date)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {fine > 0 ? (
                        <span className="text-red-600 font-semibold">${fine.toFixed(2)}</span>
                      ) : (
                        <span className="text-green-600">$0.00</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleReturn(item.id)}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                      >
                        Return
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReturnBook;

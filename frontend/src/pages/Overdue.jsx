import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Loader from '../components/Loader';
import { formatDate } from '../utils/helpers';

const Overdue = () => {
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverdue();
  }, []);

  const fetchOverdue = async () => {
    try {
      const { data } = await api.get('/overdue');
      setOverdue(data);
    } catch (error) {
      toast.error('Failed to fetch overdue books');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Overdue Books Report</h1>

      {overdue.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-green-600 text-lg font-semibold">✓ No overdue books!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700 font-semibold">
              {overdue.length} book{overdue.length > 1 ? 's' : ''} overdue
            </p>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Book</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Member</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Days Late</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {overdue.map((item) => (
                <tr key={item.id} className="bg-red-50">
                  <td className="px-4 py-3 text-sm font-medium">{item.book.title}</td>
                  <td className="px-4 py-3 text-sm">{item.member.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="text-xs">
                      <div>{item.member.email || 'N/A'}</div>
                      <div>{item.member.phone || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600 font-semibold">
                    {formatDate(item.due_date)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                      {item.days_overdue} days
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="text-red-600 font-bold">{item.current_fine}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Overdue;

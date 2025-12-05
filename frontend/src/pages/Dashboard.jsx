import { useState, useEffect } from 'react';
import { BookOpen, Users, BookMarked, AlertCircle } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBorrows, setRecentBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, usersRes, borrowedRes] = await Promise.all([
        api.get('/books'),
        api.get('/users'),
        api.get('/borrowed')
      ]);

      const books = booksRes.data;
      const users = usersRes.data;
      const borrowed = borrowedRes.data;

      const overdue = borrowed.filter(b => new Date(b.due_date) < new Date());

      setStats({
        totalBooks: books.length,
        totalMembers: users.length,
        booksIssued: borrowed.length,
        overdue: overdue.length
      });

      setRecentBorrows(borrowed.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<BookOpen className="w-8 h-8" />}
          title="Total Books"
          value={stats?.totalBooks || 0}
          color="blue"
        />
        <StatCard
          icon={<Users className="w-8 h-8" />}
          title="Total Members"
          value={stats?.totalMembers || 0}
          color="green"
        />
        <StatCard
          icon={<BookMarked className="w-8 h-8" />}
          title="Books Issued"
          value={stats?.booksIssued || 0}
          color="purple"
        />
        <StatCard
          icon={<AlertCircle className="w-8 h-8" />}
          title="Overdue Books"
          value={stats?.overdue || 0}
          color="red"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Borrowing Activity</h2>
        {recentBorrows.length === 0 ? (
          <p className="text-gray-500">No recent activity</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Book</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Member</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentBorrows.map((borrow) => (
                  <tr key={borrow.id}>
                    <td className="px-4 py-3 text-sm">{borrow.book.title}</td>
                    <td className="px-4 py-3 text-sm">{borrow.member.name}</td>
                    <td className="px-4 py-3 text-sm">{new Date(borrow.issue_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">{new Date(borrow.due_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className={`inline-flex p-3 rounded-lg ${colors[color]} mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
};

export default Dashboard;

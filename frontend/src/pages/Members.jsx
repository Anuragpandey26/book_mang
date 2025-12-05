import { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Modal from '../components/Modal';
import Loader from '../components/Loader';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/users');
      setMembers(data);
    } catch (error) {
      toast.error('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', { ...formData, role: 'member' });
      toast.success('Member added!');
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', address: '' });
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this member?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Member deleted!');
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Delete failed');
    }
  };



  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.email && m.email.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Members Management</h1>
        <button onClick={() => { setShowModal(true); setFormData({ name: '', email: '', phone: '', address: '' }); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Member</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <tr key={member.id}>
                <td className="px-4 py-3 text-sm">{member.id}</td>
                <td className="px-4 py-3 text-sm font-medium">{member.name}</td>
                <td className="px-4 py-3 text-sm">{member.email || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">{member.phone || 'N/A'}</td>
                <td className="px-4 py-3 text-sm"><span className={`px-2 py-1 rounded text-xs ${member.role === 'librarian' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{member.role}</span></td>
                <td className="px-4 py-3 text-sm">
                  {member.role !== 'librarian' && (
                    <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Member">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows="2"></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Add Member</button>
        </form>
      </Modal>
    </div>
  );
};

export default Members;

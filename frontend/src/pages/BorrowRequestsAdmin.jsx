import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Modal from '../components/Modal';
import { formatDate } from '../utils/helpers';

const BorrowRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionNote, setRejectionNote] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/borrow-requests/pending');
      setRequests(data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, bookTitle) => {
    if (!confirm(`Approve borrow request for "${bookTitle}"?`)) return;

    try {
      await api.post(`/borrow-requests/${id}/approve`);
      toast.success('Request approved and book issued!');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to approve');
    }
  };

  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setRejectionNote('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectionNote.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await api.post(`/borrow-requests/${selectedRequest.id}/reject`, {
        rejection_note: rejectionNote
      });
      toast.success('Request rejected');
      setShowRejectModal(false);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Pending Borrow Requests</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No pending requests</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Member</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Book</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Request Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{req.requester.name}</p>
                    <p className="text-sm text-gray-500">ID: {req.requester.id}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <p>{req.requester.email}</p>
                    <p className="text-gray-500">{req.requester.phone || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{req.book.title}</p>
                    <p className="text-sm text-gray-500">{req.book.author.name}</p>
                    <p className="text-xs text-gray-400">Available: {req.book.available_copies}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{formatDate(req.request_date)}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(req.id, req.book.title)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openRejectModal(req)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Borrow Request">
        <div className="space-y-4">
          <p className="text-gray-700">
            Rejecting request for: <strong>{selectedRequest?.book.title}</strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason *</label>
            <textarea
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Explain why this request is being rejected..."
              required
            />
          </div>
          <button
            onClick={handleReject}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            Confirm Rejection
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BorrowRequestsAdmin;

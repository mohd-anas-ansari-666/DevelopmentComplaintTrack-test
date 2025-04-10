import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getComplaintById,
  updateComplaintStatus,
  addComment,
  clearError
} from '../store/slices/complaintSlice';
import {
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ComplaintDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentComplaint: complaint, loading, error } = useSelector((state) => state.complaints);
  const { user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(getComplaintById(id));
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status);
      setAssignedTo(complaint.assignedTo?._id || '');
    }
  }, [complaint]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
      case 'In Progress':
        return <ExclamationCircleIcon className="h-6 w-6 text-blue-500" />;
      case 'Resolved':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'Rejected':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      await dispatch(updateComplaintStatus({ id, status, assignedTo })).unwrap();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      await dispatch(addComment({ id, text: comment }));
      setComment('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!complaint) {
    return <div className="text-center py-4">Complaint not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{complaint.title}</h1>
            <div className="flex items-center text-gray-600">
              <UserCircleIcon className="h-5 w-5 mr-2" />
              <span>Submitted by {complaint.user.name}</span>
              <span className="mx-2">•</span>
              <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center">
            {getStatusIcon(complaint.status)}
            <span className="ml-2 font-medium">{complaint.status}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Category</h3>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            {complaint.category}
          </span>
        </div>

        {user?.role === 'admin' && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Update Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="User ID (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || (status === complaint.status && assignedTo === (complaint.assignedTo?._id || ''))}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows="3"
          ></textarea>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
            disabled={!comment.trim()}
          >
            Add Comment
          </button>
        </form>

        {complaint.comments && complaint.comments.length > 0 ? (
          <div className="space-y-4">
            {complaint.comments.map((comment, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center mb-2">
                  <UserCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="font-medium">{comment.user.name}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetail; 
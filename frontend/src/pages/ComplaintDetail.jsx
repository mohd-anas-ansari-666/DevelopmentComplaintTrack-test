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
  UserCircleIcon
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

  useEffect(() => {
    dispatch(getComplaintById(id));
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
    await dispatch(updateComplaintStatus({ id, status, assignedTo }));
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
            <div className="flex space-x-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input max-w-xs"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                className="btn px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                disabled={status === complaint.status}
              >
                Update Status
              </button>
            </div>
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
            className="input h-24 mb-2"
          />
          <button type="submit" className="btn px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200">
            Add Comment
          </button>
        </form>

        <div className="space-y-4">
          {complaint.comments.map((comment, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center mb-2">
                <UserCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="font-medium">{comment.user.name}</span>
                <span className="mx-2 text-gray-500">•</span>
                <span className="text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail; 
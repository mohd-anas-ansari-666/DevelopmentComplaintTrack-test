import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getComplaints } from '../store/slices/complaintSlice';
import {
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const Complaints = () => {
  const dispatch = useDispatch();
  const { complaints, loading } = useSelector((state) => state.complaints);
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(getComplaints());
  }, [dispatch]);

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

  const filteredComplaints = complaints.filter((complaint) => {
    if (filter === 'all') return true;
    return complaint.status === filter;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Complaints</h1>
        <Link to="/complaints/create" className="btn px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200">
          New Complaint
        </Link>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700">Filter by status:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent max-w-xs"
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-4 text-gray-600">No complaints found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  {user?.role === 'admin' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/complaints/${complaint._id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {complaint.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{complaint.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(complaint.status)}
                        <span className="ml-2">{complaint.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {complaint.assignedTo ? complaint.assignedTo.name : 'Unassigned'}
                      </td>
                    )}
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

export default Complaints; 
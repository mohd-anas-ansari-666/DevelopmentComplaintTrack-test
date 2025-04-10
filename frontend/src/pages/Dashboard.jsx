import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getComplaints } from '../store/slices/complaintSlice';
import { getArticles } from '../store/slices/articleSlice';
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { complaints, loading: complaintsLoading } = useSelector((state) => state.complaints);
  const { articles, loading: articlesLoading } = useSelector((state) => state.articles);

  useEffect(() => {
    dispatch(getComplaints());
    dispatch(getArticles());
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

  const stats = {
    totalComplaints: complaints.length,
    pendingComplaints: complaints.filter(c => c.status === 'Pending').length,
    inProgressComplaints: complaints.filter(c => c.status === 'In Progress').length,
    resolvedComplaints: complaints.filter(c => c.status === 'Resolved').length,
    totalArticles: articles.length
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}!</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-primary-50">
          <div className="flex items-center">
            <ClipboardDocumentListIcon className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-primary-600">{stats.totalComplaints}</p>
            </div>
          </div>
        </div>
        <div className="card bg-yellow-50">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingComplaints}</p>
            </div>
          </div>
        </div>
        <div className="card bg-blue-50">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgressComplaints}</p>
            </div>
          </div>
        </div>
        <div className="card bg-green-50">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolvedComplaints}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Complaints</h2>
          <Link to="/complaints/create" className="btn btn-primary">
            New Complaint
          </Link>
        </div>
        {complaintsLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : complaints.length === 0 ? (
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complaints.slice(0, 5).map((complaint) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Articles */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Articles</h2>
          {user?.role === 'admin' && (
            <Link to="/articles/create" className="btn btn-primary">
              New Article
            </Link>
          )}
        </div>
        {articlesLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-4 text-gray-600">No articles found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((article) => (
              <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">
                    <Link
                      to={`/articles/${article._id}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    By {article.author.name} • {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 
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
        <div className="bg-white rounded-lg shadow-md p-6 bg-primary-50">
          <div className="flex items-center">
            <ClipboardDocumentListIcon className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-primary-600">{stats.totalComplaints}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 bg-yellow-50">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingComplaints}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 bg-blue-50">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgressComplaints}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 bg-green-50">
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Complaints</h2>
          <Link to="/complaints/create" className="px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-primary-600 text-white hover:bg-primary-700">
            New Complaint
          </Link>
        </div>
        {complaintsLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : complaints.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No complaints found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                      <Link to={`/complaints/${complaint._id}`} className="text-primary-600 hover:text-primary-800">
                        {complaint.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {complaint.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(complaint.status)}
                        <span className="ml-2">{complaint.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Articles</h2>
          {user?.role === 'admin' && (
            <Link to="/articles/create" className="px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-primary-600 text-white hover:bg-primary-700">
              New Article
            </Link>
          )}
        </div>
        {articlesLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : articles.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No articles found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.slice(0, 3).map((article) => (
              <Link
                key={article._id}
                to={`/articles/${article._id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="font-medium text-primary-600 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{article.content.substring(0, 100)}...</p>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  <span>{article.category}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 
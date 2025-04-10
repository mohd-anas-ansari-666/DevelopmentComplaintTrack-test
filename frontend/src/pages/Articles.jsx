import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getArticles } from '../store/slices/articleSlice';
import { DocumentTextIcon, TagIcon } from '@heroicons/react/24/outline';

const Articles = () => {
  const dispatch = useDispatch();
  const { articles, loading } = useSelector((state) => state.articles);
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(getArticles());
  }, [dispatch]);

  const categories = ['all', 'Development', 'Infrastructure', 'Security', 'Best Practices'];

  const filteredArticles = articles.filter((article) => {
    if (filter === 'all') return true;
    return article.category === filter;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        {user?.role === 'admin' && (
          <Link to="/articles/create" className="btn btn-primary">
            Create Article
          </Link>
        )}
      </div>

      {/* Filter */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="card text-center py-12">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-500">
            {filter === 'all'
              ? 'There are no articles in the knowledge base yet.'
              : `There are no articles in the ${filter} category yet.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Link
              key={article._id}
              to={`/articles/${article._id}`}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-bold mb-2 text-primary-600">{article.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{article.content.substring(0, 150)}...</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {article.category}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {article.tags && article.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Articles; 
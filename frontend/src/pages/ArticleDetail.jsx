import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getArticleById } from '../store/slices/articleSlice';
import { DocumentTextIcon, TagIcon, UserCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';

const ArticleDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentArticle: article, loading, error } = useSelector((state) => state.articles);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getArticleById(id));
  }, [dispatch, id]);

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

  if (!article) {
    return <div className="text-center py-4">Article not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <UserCircleIcon className="h-5 w-5 mr-2" />
              <span>By {article.author.name}</span>
              <span className="mx-2">•</span>
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {article.category}
              </span>
            </div>
          </div>
          {user?.role === 'admin' && (
            <Link to={`/articles/edit/${article._id}`} className="btn btn-primary">
              Edit Article
            </Link>
          )}
        </div>

        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap">{article.content}</div>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                >
                  <TagIcon className="h-4 w-4 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Link to="/articles" className="btn btn-secondary">
          Back to Articles
        </Link>
        {user?.role === 'admin' && (
          <button className="btn btn-danger">Delete Article</button>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail; 
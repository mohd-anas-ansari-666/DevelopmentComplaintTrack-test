import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createArticle, clearError } from '../store/slices/articleSlice';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const CreateArticle = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Development',
    tags: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.articles);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/articles');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert tags string to array
    const articleData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
    };
    
    const result = await dispatch(createArticle(articleData));
    if (!result.error) {
      navigate('/articles');
    }
  };

  const categories = ['Development', 'Infrastructure', 'Security', 'Best Practices'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center mb-6">
          <DocumentTextIcon className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold">Create New Article</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="input h-64"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="input"
              placeholder="e.g. React, JavaScript, Web Development"
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate tags with commas (e.g., React, JavaScript, Web Development)
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/articles')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle; 
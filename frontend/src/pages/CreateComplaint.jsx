import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createComplaint, clearError } from '../store/slices/complaintSlice';

const CreateComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Infrastructure'
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.complaints);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createComplaint(formData));
    if (!result.error) {
      navigate('/complaints');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Complaint</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="Infrastructure">Infrastructure</option>
              <option value="Security">Security</option>
              <option value="Environment">Environment</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent h-32"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/complaints')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn px-4 py-2 bg-primary-600 text-black rounded-md hover:bg-primary-700 transition-colors duration-200" disabled={loading}>
              {loading ? 'Creating...' : 'Create Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint; 
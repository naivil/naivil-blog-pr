import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog, clearError } from '../features/blog/blogslice';
import { useNavigate } from 'react-router-dom';
import { MdPublish, MdCancel } from 'react-icons/md';
import '../styles/style.css';

const AddBlogs = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Technology',
  });
  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.content) {
      setFormError('Please fill in all fields');
      return;
    }

    dispatch(clearError());

    const newBlog = {
      id: Date.now().toString(),
      ...formData,
      userId: user.id,
      authorName: user.fullName,
      likes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dispatch(createBlog(newBlog));
    navigate('/my-blogs');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container">
      <div className="form-container">
        <h1>✍️ Create New Blog</h1>
        <p className="form-subtitle">Share your thoughts with the world and inspire others</p>

        <form onSubmit={handleSubmit} className="blog-form">
          {(error || formError) && (
            <div className="error-message">{error || formError}</div>
          )}

          <div className="form-group">
            <label htmlFor="title">📝 Blog Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title for your blog"
              maxLength="100"
              required
            />
            <small>{formData.title.length}/100 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">📌 Short Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a brief summary of your blog"
              maxLength="200"
              required
            />
            <small>{formData.description.length}/200 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="category">🏷️ Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Technology">Technology</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Business">Business</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="content">📚 Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your complete blog content here..."
              rows="12"
              required
            ></textarea>
            <small>{formData.content.length} characters</small>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              <MdPublish className="form-icon" /> {loading ? 'Publishing...' : 'Publish Blog'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/my-blogs')}
            >
              <MdCancel className="form-icon" /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogs;

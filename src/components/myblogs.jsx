import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, deleteBlog, toggleLikeBlog, updateBlog } from '../features/blog/blogslice';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdDelete, MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import '../styles/style.css';

const MyBlogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { blogs, loading } = useSelector((state) => state.blog);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.id) {
      dispatch(fetchBlogs(user.id));
    }
  }, [isAuthenticated, user?.id, dispatch, navigate]);

  const userBlogs = blogs.filter((blog) => blog.userId === user?.id);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      dispatch(deleteBlog(id));
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setEditData({ ...blog });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editData.title || !editData.description || !editData.content) {
      alert('Please fill in all fields');
      return;
    }

    dispatch(updateBlog({ 
      id: editingId, 
      data: {
        title: editData.title,
        description: editData.description,
        content: editData.content,
        category: editData.category,
        updatedAt: new Date().toISOString()
      }
    }));
    
    setShowEditModal(false);
    setEditingId(null);
    setEditData({});
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingId(null);
    setEditData({});
  };

  const handleLike = (id) => {
    dispatch(toggleLikeBlog({ id, userId: user.id }));
  };

  const isLiked = (blog) => {
    return blog.likes && blog.likes.includes(user.id);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container loading-container">
        <div className="spinner"></div>
        <p>Loading your blogs...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>📚 My Blogs</h1>
        <p>Manage and share your stories with the community</p>
      </div>

      {userBlogs.length === 0 ? (
        <div className="empty-state">
          <h2>✨ No blogs yet</h2>
          <p>Start creating and sharing your thoughts with the world</p>
          <a href="/add-blog" className="action-btn">
            ✍️ Create Your First Blog
          </a>
        </div>
      ) : (
        <div className="my-blogs-list">
          {userBlogs.map((blog) => (
            <div key={blog.id} className="blog-list-item">
              <div className="blog-list-content">
                <h3 className="blog-title">{blog.title}</h3>
                <span className="blog-category">{blog.category}</span>
                <p className="blog-excerpt">{blog.description}</p>
                <div className="blog-info">
                  <span className="blog-date">
                    📅 {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="blog-likes-badge">
                    ❤️ {blog.likes?.length || 0} likes
                  </span>
                </div>
              </div>

              <div className="blog-actions">
                <button
                  className="like-btn"
                  onClick={() => handleLike(blog.id)}
                  title={isLiked(blog) ? "Unlike blog" : "Like blog"}
                  aria-label="Like blog"
                >
                  {isLiked(blog) ? (
                    <><MdFavorite /> Liked</>
                  ) : (
                    <><MdFavoriteBorder /> Like</>
                  )}
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(blog)}
                  title="Edit blog"
                  aria-label="Edit blog"
                >
                  <MdEdit /> Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(blog.id)}
                  title="Delete blog"
                  aria-label="Delete blog"
                >
                  <MdDelete /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Blog</h2>
              <button className="modal-close" onClick={handleCancelEdit}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="edit-title">Title</label>
                <input
                  id="edit-title"
                  type="text"
                  value={editData.title || ''}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  placeholder="Blog title"
                  maxLength="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">Description</label>
                <input
                  id="edit-description"
                  type="text"
                  value={editData.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Short description"
                  maxLength="200"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-category">Category</label>
                <select
                  id="edit-category"
                  value={editData.category || 'Technology'}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                >
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Travel">Travel</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-content">Content</label>
                <textarea
                  id="edit-content"
                  value={editData.content || ''}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                  placeholder="Write your blog content here"
                  rows="10"
                  maxLength="2000"
                />
                <small>{(editData.content || '').length}/2000</small>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
              <button className="submit-btn" onClick={handleSaveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;

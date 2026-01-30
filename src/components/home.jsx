import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../features/blog/blogslice';
import { useNavigate } from 'react-router-dom';
import { MdWavingHand, MdArticle, MdFavoriteBorder, MdCalendarToday } from 'react-icons/md';
import '../styles/style.css';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { blogs, loading } = useSelector((state) => state.blog);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.id) {
      dispatch(fetchBlogs(user.id));
    }
  }, [isAuthenticated, user?.id, dispatch, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container loading-container">
        <div className="spinner"></div>
        <p>Loading community blogs...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-content">
          <h1><MdWavingHand className="hero-icon" /> Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
          <p>Discover and explore inspiring stories from our amazing community</p>
        </div>
      </section>

      <div className="section-header">
        <h2><MdArticle className="section-icon" /> Community Blogs</h2>
        <p>Find great content and support your fellow writers</p>
      </div>

      {blogs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📰</div>
          <h2>No blogs yet</h2>
          <p>Be the first to share your story with the community</p>
          <a href="/add-blog" className="action-btn">
            ✍️ Create Your First Blog
          </a>
        </div>
      ) : (
        <>
          <div className="blog-stats">
            <div className="stat-card">
              <span className="stat-number">{blogs.length}</span>
              <span className="stat-label">Total Blogs</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{blogs.reduce((sum, b) => sum + (b.likes?.length || 0), 0)}</span>
              <span className="stat-label">Total Likes</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{new Set(blogs.map(b => b.userId)).size}</span>
              <span className="stat-label">Active Writers</span>
            </div>
          </div>

          <div className="blogs-grid">
            {blogs.map((blog) => (
              <div key={blog.id} className="blog-card">
                <div className="blog-card-header">
                  <span className="blog-category-badge">{blog.category}</span>
                  <h3 className="blog-title">{blog.title}</h3>
                </div>
                <p className="blog-author">By <strong>{blog.authorName}</strong></p>
                <p className="blog-description">{blog.description}</p>
                <div className="blog-meta">
                  <span className="blog-date">
                    <MdCalendarToday className="meta-icon" /> {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="blog-likes">
                    <MdFavoriteBorder className="meta-icon" /> {blog.likes?.length || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

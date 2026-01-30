import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/user/userslice';
import { Link, useNavigate } from 'react-router-dom';
import { MdHome, MdArticle, MdAdd, MdLogout, MdPerson } from 'react-icons/md';
import '../styles/style.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/" className="logo-text">
            ✨ BlogHub
          </Link>
        </div>

        {isAuthenticated ? (
          <nav className="nav-authenticated">
            <Link to="/" className="nav-link">
              <MdHome className="nav-icon" /> Home
            </Link>
            <Link to="/my-blogs" className="nav-link">
              <MdArticle className="nav-icon" /> My Blogs
            </Link>
            <Link to="/add-blog" className="nav-link add-blog-btn">
              <MdAdd className="nav-icon" /> New Blog
            </Link>
            <Link to="/profile" className="nav-link profile-link">
              <MdPerson className="nav-icon" /> {user?.fullName?.split(' ')[0]}
            </Link>
            <button onClick={handleLogout} className="nav-link logout-btn">
              <MdLogout className="nav-icon" /> Logout
            </button>
          </nav>
        ) : (
          <nav className="nav-guest">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link signup-btn">
              Sign Up
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

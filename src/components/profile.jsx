import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, updateUserProfile, clearError } from '../features/user/userslice';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdEmail, MdPerson, MdCalendarToday, MdDescription, MdCheckCircle } from 'react-icons/md';
import '../styles/style.css';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: '',
    email: '',
    bio: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (userId && user?.id !== userId) {
      dispatch(fetchCurrentUser());
    }

    if (user) {
      setEditData({
        fullName: user.fullName || '',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
  }, [isAuthenticated, user, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!editData.fullName || !editData.email) {
      alert('Full name and email are required');
      return;
    }

    await dispatch(
      updateUserProfile({
        id: user.id,
        data: editData,
      })
    );

    setSuccessMessage('Profile updated successfully!');
    setIsEditing(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar">
            <MdPerson className="avatar-icon" />
          </div>
          <div className="profile-title">
            <h1>{user?.fullName}</h1>
            <p className="profile-email">
              <MdEmail className="profile-icon" /> {user?.email}
            </p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">
            <MdCheckCircle className="message-icon" /> {successMessage}
          </div>
        )}

        {!isEditing ? (
          <div className="profile-view">
            <div className="profile-section">
              <h2>📋 Profile Information</h2>
              <div className="profile-item">
                <div className="profile-item-header">
                  <MdPerson className="item-icon" />
                  <label>Full Name</label>
                </div>
                <p>{user?.fullName}</p>
              </div>
              <div className="profile-item">
                <div className="profile-item-header">
                  <MdEmail className="item-icon" />
                  <label>Email</label>
                </div>
                <p>{user?.email}</p>
              </div>
              <div className="profile-item">
                <div className="profile-item-header">
                  <MdDescription className="item-icon" />
                  <label>Bio</label>
                </div>
                <p>{user?.bio || 'No bio added yet'}</p>
              </div>
              <div className="profile-item">
                <div className="profile-item-header">
                  <MdCalendarToday className="item-icon" />
                  <label>Member Since</label>
                </div>
                <p>{new Date(user?.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>

            <button
              className="submit-btn"
              onClick={() => setIsEditing(true)}
            >
              <MdEdit className="form-icon" /> Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <h2>✏️ Edit Your Profile</h2>

            <div className="form-group">
              <label htmlFor="fullName">
                <MdPerson className="form-label-icon" /> Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={editData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <MdEmail className="form-label-icon" /> Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">
                <MdDescription className="form-label-icon" /> Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={editData.bio}
                onChange={handleChange}
                rows="5"
                placeholder="Tell us about yourself..."
                maxLength="500"
              ></textarea>
              <small>{editData.bio.length}/500 characters</small>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                <MdCheckCircle className="form-icon" /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  setEditData({
                    fullName: user?.fullName || '',
                    email: user?.email || '',
                    bio: user?.bio || '',
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;

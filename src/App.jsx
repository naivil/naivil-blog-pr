import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { fetchCurrentUser } from './features/user/userslice';
import Header from './components/header';
import Home from './components/home';
import Login from './components/login';
import Signup from './components/signup';
import AddBlogs from './components/add-blogs';
import MyBlogs from './components/myblogs';
import Profile from './components/profile';
import './styles/style.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: userLoading } = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  if (userLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/add-blog" element={<AddBlogs />} />
            <Route path="/my-blogs" element={<MyBlogs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/signup" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Compass, CalendarCheck, LogIn, UserPlus, LogOut, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Home className="brand-icon" size={28} />
          <span>HomelyHub</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/properties" className="nav-link">
            <Compass size={18} />
            <span>Explore</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/my-bookings" className="nav-link">
                <CalendarCheck size={18} />
                <span>My Bookings</span>
              </Link>
              <div className="user-menu">
                <span className="user-greeting">
                  <User size={16} />
                  <span>{user?.name || 'Traveler'}</span>
                  {user?.role === 'owner' && (
                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Host)</span>
                  )}
                </span>
                <button onClick={handleLogout} className="btn-logout" title="Logout">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="btn-signup">
                <UserPlus size={16} />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

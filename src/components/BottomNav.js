import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './BottomNav.css';

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Don't show on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Home</span>
      </button>

      <button
        className={`nav-item ${isActive('/my-appointments') ? 'active' : ''}`}
        onClick={() => navigate('/my-appointments')}
      >
        <span className="nav-icon">📅</span>
        <span className="nav-label">Appointments</span>
      </button>

      {user?.role === 'business_owner' && (
        <button
          className={`nav-item ${isActive('/my-business') ? 'active' : ''}`}
          onClick={() => navigate('/my-business')}
        >
          <span className="nav-icon">💼</span>
          <span className="nav-label">Business</span>
        </button>
      )}

      <button
        className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
        onClick={() => {
          // Future: navigate to profile page
          alert('Profile feature coming soon!');
        }}
      >
        <span className="nav-icon">👤</span>
        <span className="nav-label">Profile</span>
      </button>
    </nav>
  );
}

export default BottomNav;
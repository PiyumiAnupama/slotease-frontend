import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Home.css';

function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await api.get('/businesses');
      setBusinesses(response.data.businesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // FIXED FILTER FUNCTION
  const filteredBusinesses = businesses.filter((business) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      business.name.toLowerCase().includes(searchLower) ||
      business.description.toLowerCase().includes(searchLower) ||
      business.address.city.toLowerCase().includes(searchLower);
    
    const matchesCategory = categoryFilter === 'all' || business.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading businesses...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">SlotEase</h1>
          <div className="user-menu">
            <span className="user-name">Hello, {user?.name}</span>
            <button onClick={() => navigate('/my-appointments')} className="btn-secondary">
              My Appointments
            </button>
            {user?.role === 'business_owner' && (
              <button onClick={() => navigate('/my-business')} className="btn-secondary">
                My Business
              </button>
            )}
            <button onClick={handleLogout} className="btn-outline">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Book Your Next Appointment</h2>
          <p>Find and book services from top-rated businesses in Sri Lanka</p>
        </div>
      </section>

      {/* Search & Filter */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by business name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="clear-search"
              >
                ✕
              </button>
            )}
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            <option value="salon">💇 Salon</option>
            <option value="clinic">🏥 Clinic</option>
            <option value="legal">⚖️ Legal</option>
            <option value="tutoring">📚 Tutoring</option>
            <option value="mechanic">🔧 Mechanic</option>
            <option value="other">📋 Other</option>
          </select>
        </div>
      </div>

      {/* Business Grid */}
      <div className="content-container">
        <h3 className="section-title">
          {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'Business' : 'Businesses'} Found
        </h3>

        {filteredBusinesses.length === 0 ? (
          <div className="empty-state">
            <p>No businesses found matching your criteria</p>
            {(searchTerm || categoryFilter !== 'all') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="business-grid">
            {filteredBusinesses.map((business) => (
              <div key={business._id} className="business-card">
                <div className="business-category-badge">
                  {business.category}
                </div>
                <h3 className="business-name">{business.name}</h3>
                <p className="business-description">{business.description}</p>
                <div className="business-info">
                  <div className="info-item">
                    <span className="icon">📍</span>
                    <span>{business.address.city}, {business.address.state}</span>
                  </div>
                  <div className="info-item">
                    <span className="icon">📞</span>
                    <span>{business.contactPhone}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/business/${business._id}`)}
                  className="btn-primary"
                >
                  View Services
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
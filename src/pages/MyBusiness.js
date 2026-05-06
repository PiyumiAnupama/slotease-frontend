import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './MyBusiness.css';

function MyBusiness() {
  const { user } = useContext(AuthContext);
  const [businesses, setBusinesses] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'business_owner') {
      navigate('/');
      return;
    }
    fetchBusinessData();
  }, [user]);

  const fetchBusinessData = async () => {
    try {
      const [businessRes, appointmentRes] = await Promise.all([
        api.get('/businesses/my-businesses'),
        api.get('/appointments')
      ]);
      
      setBusinesses(businessRes.data.businesses);
      setAppointments(appointmentRes.data.appointments);

      // Fetch services for the first business
      if (businessRes.data.businesses.length > 0) {
        const serviceRes = await api.get(`/services/business/${businessRes.data.businesses[0]._id}`);
        setServices(serviceRes.data.services);
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { status: newStatus });
      alert('Status updated successfully');
      fetchBusinessData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#10b981',
      completed: '#6b7280',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="no-business-container">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
        <div className="empty-state">
          <div className="empty-icon">🏢</div>
          <h2>No Business Registered</h2>
          <p>You haven't registered a business yet.</p>
          <p className="helper-text">
            To register your business, please contact the administrator or use the business registration form.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const business = businesses[0]; // For now, show first business

  return (
    <div className="my-business-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Home
      </button>

      <div className="business-dashboard">
        <div className="dashboard-header">
          <div>
            <h1>{business.name}</h1>
            <p className="business-subtitle">{business.category} • {business.address.city}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === 'overview' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={activeTab === 'services' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('services')}
          >
            Services ({services.length})
          </button>
          <button
            className={activeTab === 'appointments' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments ({appointments.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{services.length}</div>
                  <div className="stat-label">Services</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{appointments.filter(a => a.status === 'pending').length}</div>
                  <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{appointments.filter(a => a.status === 'confirmed').length}</div>
                  <div className="stat-label">Confirmed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{appointments.filter(a => a.status === 'completed').length}</div>
                  <div className="stat-label">Completed</div>
                </div>
              </div>

              <div className="business-info-section">
                <h3>Business Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Contact Email:</label>
                    <span>{business.contactEmail}</span>
                  </div>
                  <div className="info-item">
                    <label>Contact Phone:</label>
                    <span>{business.contactPhone}</span>
                  </div>
                  <div className="info-item">
                    <label>Address:</label>
                    <span>{business.address.street}, {business.address.city}</span>
                  </div>
                  <div className="info-item">
                    <label>Category:</label>
                    <span className="category-badge">{business.category}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="services-section">
              {services.length === 0 ? (
                <div className="empty-message">
                  <p>No services added yet.</p>
                </div>
              ) : (
                <div className="services-list">
                  {services.map((service) => (
                    <div key={service._id} className="service-item">
                      <div className="service-main">
                        <h4>{service.name}</h4>
                        <p>{service.description}</p>
                      </div>
                      <div className="service-meta">
                        <span className="service-duration">⏱️ {service.duration} min</span>
                        <span className="service-price">{service.currency} {service.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="appointments-section">
              {appointments.length === 0 ? (
                <div className="empty-message">
                  <p>No appointments yet.</p>
                </div>
              ) : (
                <div className="appointments-table">
                  {appointments.map((appointment) => (
                    <div key={appointment._id} className="appointment-row">
                      <div className="appointment-info">
                        <div className="appointment-customer">
                          <strong>{appointment.customerName}</strong>
                          <span className="customer-email">{appointment.customerEmail}</span>
                        </div>
                        <div className="appointment-service">{appointment.service?.name}</div>
                        <div className="appointment-datetime">
                          {formatDate(appointment.appointmentDate)} at {appointment.startTime}
                        </div>
                      </div>
                      <div className="appointment-actions">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(appointment.status) }}
                        >
                          {appointment.status}
                        </span>
                        {appointment.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                            className="btn-confirm"
                          >
                            Confirm
                          </button>
                        )}
                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                            className="btn-complete"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyBusiness;
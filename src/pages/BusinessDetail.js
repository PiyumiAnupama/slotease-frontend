import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';
import './BusinessDetail.css';

function BusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchBusinessAndServices = useCallback(async () => {
    try {
      const [businessRes, servicesRes] = await Promise.all([
        api.get(`/businesses/${id}`),
        api.get(`/services/business/${id}`)
      ]);

      setBusiness(businessRes.data.business);
      setServices(servicesRes.data.services);
    } catch (error) {
      console.error('Error fetching data:', error);
      setToast({ message: 'Failed to load business details', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBusinessAndServices();
  }, [fetchBusinessAndServices]);

  const formatOperatingHours = (hours) => {
    if (!hours) return {};
    
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const formatted = {};
    
    daysOfWeek.forEach(day => {
      if (hours[day]) {
        formatted[day] = hours[day];
      }
    });
    
    return formatted;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="error-container">
        <h2>Business not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  const operatingHours = formatOperatingHours(business.operatingHours);

  return (
    <div className="business-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="business-header">
        <div className="business-header-content">
          <h1>{business.name}</h1>
          <span className="category-badge">{business.category}</span>
        </div>
        <p className="business-description">{business.description}</p>
      </div>

      <div className="business-info-section">
        <h2>Contact Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">📞 Phone:</span>
            <span className="info-value">{business.contactPhone}</span>
          </div>
          <div className="info-item">
            <span className="info-label">📧 Email:</span>
            <span className="info-value">{business.contactEmail}</span>
          </div>
          <div className="info-item">
            <span className="info-label">📍 Address:</span>
            <span className="info-value">
              {business.address?.street}, {business.address?.city}, {business.address?.province}
            </span>
          </div>
        </div>
      </div>

      <div className="operating-hours-section">
        <h2>Operating Hours</h2>
        <div className="hours-grid">
          {Object.entries(operatingHours).map(([day, hours]) => (
            <div key={day} className="hours-item">
              <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
              <span className="hours-time">
                {hours.open === 'Closed' ? 'Closed' : `${hours.open} - ${hours.close}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="services-section">
        <h2>Available Services</h2>
        {services.length === 0 ? (
          <p className="no-services">No services available at this time.</p>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <div key={service._id} className="service-card">
                <div className="service-header">
                  <h3>{service.name}</h3>
                  <span className="service-price">
                    {service.currency} {service.price.toLocaleString()}
                  </span>
                </div>
                <p className="service-description">{service.description}</p>
                <div className="service-footer">
                  <span className="service-duration">⏱️ {service.duration} minutes</span>
                  <button
                    className="btn-book"
                    onClick={() => navigate(`/book/${service._id}`)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default BusinessDetail;
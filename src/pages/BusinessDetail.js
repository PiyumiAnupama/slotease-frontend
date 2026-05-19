import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './BusinessDetail.css';

function BusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinessAndServices();
  }, [id]);

  const fetchBusinessAndServices = async () => {
    try {
      const [businessRes, servicesRes] = await Promise.all([
        api.get(`/businesses/${id}`),
        api.get(`/services/business/${id}`)
      ]);
      setBusiness(businessRes.data.business);
      setServices(servicesRes.data.services);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="business-detail-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Businesses
      </button>

      <div className="business-header">
        <div className="business-header-content">
          <h1>{business.name}</h1>
          <span className="category-badge">{business.category}</span>
        </div>
        <p className="business-description-full">{business.description}</p>

        <div className="business-contact-info">
          <div className="contact-item">
            <span className="icon">📍</span>
            <span>{business.address.street}, {business.address.city}, {business.address.state}</span>
          </div>
          <div className="contact-item">
            <span className="icon">📞</span>
            <span>{business.contactPhone}</span>
          </div>
          <div className="contact-item">
            <span className="icon">✉️</span>
            <span>{business.contactEmail}</span>
          </div>
        </div>
      </div>

      <div className="services-section">
        <h2>Available Services</h2>
        {services.length === 0 ? (
          <div className="empty-state">
            <p>No services available at the moment</p>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <div key={service._id} className="service-card">
                <div className="service-header">
                  <h3>{service.name}</h3>
                  <div className="service-price">
                    {service.currency} {service.price.toLocaleString()}
                  </div>
                </div>
                <p className="service-description">{service.description}</p>
                <div className="service-duration">
                  ⏱️ {service.duration} minutes
                </div>
                <button
                  onClick={() => navigate(`/book/${service._id}`)}
                  className="btn-primary"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessDetail;
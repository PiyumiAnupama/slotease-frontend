import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';
import './RegisterBusiness.css';

function RegisterBusiness() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'salon',
    contactEmail: '',
    contactPhone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Sri Lanka',
    mondayOpen: '09:00',
    mondayClose: '18:00',
    tuesdayOpen: '09:00',
    tuesdayClose: '18:00',
    wednesdayOpen: '09:00',
    wednesdayClose: '18:00',
    thursdayOpen: '09:00',
    thursdayClose: '18:00',
    fridayOpen: '09:00',
    fridayClose: '18:00',
    saturdayOpen: '09:00',
    saturdayClose: '16:00',
    sundayOpen: 'Closed',
    sundayClose: 'Closed',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const businessData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        operatingHours: {
          monday: { open: formData.mondayOpen, close: formData.mondayClose },
          tuesday: { open: formData.tuesdayOpen, close: formData.tuesdayClose },
          wednesday: { open: formData.wednesdayOpen, close: formData.wednesdayClose },
          thursday: { open: formData.thursdayOpen, close: formData.thursdayClose },
          friday: { open: formData.fridayOpen, close: formData.fridayClose },
          saturday: { open: formData.saturdayOpen, close: formData.saturdayClose },
          sunday: { open: formData.sundayOpen, close: formData.sundayClose },
        },
      };

      await api.post('/businesses', businessData);
      setToast({ message: 'Business registered successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/my-business');
      }, 2000);
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to register business',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-business-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="register-business-card">
        <h1>Register Your Business</h1>
        <p className="subtitle">Join SlotEase and start accepting appointments</p>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label>Business Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Elegant Hair Salon"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Describe your business and services..."
              ></textarea>
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="salon">💇 Salon</option>
                <option value="clinic">🏥 Clinic</option>
                <option value="legal">⚖️ Legal</option>
                <option value="tutoring">📚 Tutoring</option>
                <option value="mechanic">🔧 Mechanic</option>
                <option value="other">📋 Other</option>
              </select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3>Contact Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Contact Email *</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  placeholder="contact@business.com"
                />
              </div>

              <div className="form-group">
                <label>Contact Phone *</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                  placeholder="+94 77 123 4567"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="form-section">
            <h3>Business Address</h3>
            
            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                placeholder="123 Main Street"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Galle"
                />
              </div>

              <div className="form-group">
                <label>State/Province *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="Southern Province"
                />
              </div>

              <div className="form-group">
                <label>Zip Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  placeholder="80000"
                />
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="form-section">
            <h3>Operating Hours</h3>
            <p className="helper-text">Set your business hours for each day</p>
            
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
              <div key={day} className="hours-row">
                <label className="day-label">{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                <input
                  type="time"
                  name={`${day}Open`}
                  value={formData[`${day}Open`]}
                  onChange={handleChange}
                  disabled={formData[`${day}Open`] === 'Closed'}
                />
                <span>to</span>
                <input
                  type="time"
                  name={`${day}Close`}
                  value={formData[`${day}Close`]}
                  onChange={handleChange}
                  disabled={formData[`${day}Open`] === 'Closed'}
                />
                <label className="closed-checkbox">
                  <input
                    type="checkbox"
                    checked={formData[`${day}Open`] === 'Closed'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          [`${day}Open`]: 'Closed',
                          [`${day}Close`]: 'Closed',
                        });
                      } else {
                        setFormData({
                          ...formData,
                          [`${day}Open`]: '09:00',
                          [`${day}Close`]: '18:00',
                        });
                      }
                    }}
                  />
                  Closed
                </label>
              </div>
            ))}
          </div>

          <button type="submit" className="btn-primary btn-large" disabled={loading}>
            {loading ? 'Registering...' : 'Register Business'}
          </button>
        </form>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

export default RegisterBusiness;
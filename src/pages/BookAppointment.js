import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';
import './BookAppointment.css';

function BookAppointment() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [business, setBusiness] = useState(null);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    startTime: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [success, setSuccess] = useState(false);

  // Generate time slots (9 AM to 6 PM, 30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 18 && minute > 0) break;
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      console.log('=== FETCHING SERVICE ===');
      console.log('Service ID:', serviceId);

      const response = await api.get(`/services/${serviceId}`);
      console.log('Service response:', response.data);
      
      setService(response.data.service);
      setBusiness(response.data.service.business);
      
      // Pre-fill customer data
      const userResponse = await api.get('/auth/me');
      console.log('User data:', userResponse.data);
      
      setFormData(prev => ({
        ...prev,
        customerName: userResponse.data.name || '',
        customerEmail: userResponse.data.email || ''
      }));
    } catch (error) {
      console.error('=== ERROR FETCHING SERVICE ===');
      console.error('Error:', error);
      console.error('Response:', error.response?.data);
      setToast({ message: 'Service not found', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const appointmentData = {
        service: serviceId,
        appointmentDate: formData.appointmentDate,
        startTime: formData.startTime,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        notes: formData.notes
      };

      console.log('=== BOOKING APPOINTMENT ===');
      console.log('Data being sent:', appointmentData);

      const response = await api.post('/appointments', appointmentData);
      
      console.log('=== APPOINTMENT CREATED SUCCESSFULLY ===');
      console.log('Response:', response.data);
      console.log('Appointment ID:', response.data.appointment?._id);

      setSuccess(true);
      setToast({ message: 'Appointment booked successfully!', type: 'success' });
      
      setTimeout(() => {
        navigate('/my-appointments');
      }, 2000);
    } catch (err) {
      console.error('=== BOOKING ERROR ===');
      console.error('Error:', err);
      console.error('Error Response:', err.response?.data);
      console.error('Error Status:', err.response?.status);
      
      setToast({ 
        message: err.response?.data?.message || 'Failed to create appointment', 
        type: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!service || !business) {
    return (
      <div className="error-container">
        <h2>Service not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h2>Appointment Booked!</h2>
        <p>Your appointment has been successfully created.</p>
        <p className="redirect-text">Redirecting to your appointments...</p>
      </div>
    );
  }

  return (
    <div className="book-appointment-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="booking-layout">
        {/* Service Summary */}
        <div className="service-summary">
          <h2>Booking Details</h2>
          <div className="summary-card">
            <h3>{service.name}</h3>
            <p className="business-name">{business.name}</p>
            <div className="summary-details">
              <div className="detail-item">
                <span className="label">Duration:</span>
                <span className="value">{service.duration} minutes</span>
              </div>
              <div className="detail-item">
                <span className="label">Price:</span>
                <span className="value">{service.currency} {service.price.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="label">Location:</span>
                <span className="value">{business.address?.city || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="booking-form-section">
          <h2>Select Date & Time</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Date *</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={getMinDate()}
                required
              />
            </div>

            <div className="form-group">
              <label>Select Time *</label>
              <select
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              >
                <option value="">Choose a time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-divider"></div>

            <h3>Contact Information</h3>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                placeholder="+94 77 123 4567"
                required
              />
            </div>

            <div className="form-group">
              <label>Additional Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Any special requests or notes..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn-primary btn-large" 
              disabled={submitting}
            >
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
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

export default BookAppointment;
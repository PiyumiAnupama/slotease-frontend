import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';
import './MyAppointments.css';

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      console.log('Appointments fetched:', response.data); // Debug log
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setToast({ 
        message: 'Failed to load appointments', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await api.patch(`/appointments/${appointmentId}/cancel`);
      setToast({ message: 'Appointment cancelled successfully', type: 'success' });
      fetchAppointments();
    } catch (error) {
      setToast({ 
        message: error.response?.data?.message || 'Failed to cancel appointment', 
        type: 'error' 
      });
    }
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="my-appointments-container">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
        <h1>My Appointments</h1>
      </div>

      {appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h2>No Appointments Yet</h2>
          <p>You haven't booked any appointments yet.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Browse Businesses
          </button>
        </div>
      ) : (
        <div className="appointments-grid">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-header">
                <h3>{appointment.service?.name || 'Service'}</h3>
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(appointment.status) }}
                >
                  {appointment.status}
                </span>
              </div>

              <div className="appointment-business">
                <strong>{appointment.business?.name || 'Business'}</strong>
              </div>

              <div className="appointment-details">
                <div className="detail-row">
                  <span className="icon">📅</span>
                  <span>{formatDate(appointment.appointmentDate)}</span>
                </div>
                <div className="detail-row">
                  <span className="icon">🕐</span>
                  <span>{appointment.startTime} - {appointment.endTime}</span>
                </div>
                <div className="detail-row">
                  <span className="icon">💰</span>
                  <span>{appointment.currency} {appointment.totalPrice?.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="icon">📞</span>
                  <span>{appointment.business?.contactPhone || 'N/A'}</span>
                </div>
              </div>

              {appointment.notes && (
                <div className="appointment-notes">
                  <strong>Notes:</strong> {appointment.notes}
                </div>
              )}

              {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                <button
                  onClick={() => handleCancel(appointment._id)}
                  className="btn-cancel"
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}

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

export default MyAppointments;
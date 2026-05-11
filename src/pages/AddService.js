import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';
import './AddService.css';

function AddService() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business: '',
    name: '',
    description: '',
    duration: 30,
    price: '',
    currency: 'LKR'
  });

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await api.get('/businesses/my-businesses');
      setBusinesses(response.data.businesses || []);
      if (response.data.businesses && response.data.businesses.length > 0) {
        setFormData(prev => ({ ...prev, business: response.data.businesses[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/services', {
        business: formData.business,
        name: formData.name,
        description: formData.description,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        currency: formData.currency
      });

      setToast({ message: 'Service added successfully!', type: 'success' });
      
      // Reset form
      setFormData({
        business: formData.business,
        name: '',
        description: '',
        duration: 30,
        price: '',
        currency: 'LKR'
      });

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/my-business');
      }, 1500);
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to add service',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (businesses.length === 0) {
    return (
      <div className="add-service-container">
        <button onClick={() => navigate('/my-business')} className="back-button">
          ← Back
        </button>
        <div className="empty-state">
          <h2>No Business Found</h2>
          <p>You need to register a business before adding services.</p>
          <button onClick={() => navigate('/register-business')} className="btn-primary">
            Register Business
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-service-container">
      <button onClick={() => navigate('/my-business')} className="back-button">
        ← Back to My Business
      </button>

      <div className="add-service-card">
        <h1>Add New Service</h1>
        <p className="subtitle">Add a service that customers can book</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Business *</label>
            <select 
              name="business" 
              value={formData.business} 
              onChange={handleChange}
              required
            >
              {businesses.map(business => (
                <option key={business._id} value={business._id}>
                  {business.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Service Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., General Consultation, Haircut, Legal Consultation"
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
              placeholder="Describe what this service includes..."
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duration (minutes) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="15"
                step="15"
              />
            </div>

            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Currency</label>
              <select name="currency" value={formData.currency} onChange={handleChange}>
                <option value="LKR">LKR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary btn-large" disabled={loading}>
            {loading ? 'Adding Service...' : 'Add Service'}
          </button>
        </form>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

export default AddService;
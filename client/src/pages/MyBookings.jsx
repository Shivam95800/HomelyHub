import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Clock, AlertCircle, XCircle, CheckCircle } from 'lucide-react';
import api from '../api/axios';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.get('/bookings/my');
      if (response.data && response.data.data) {
        setBookings(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      setActionMessage('Booking successfully cancelled');
      fetchBookings();
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="my-bookings-page">
      <div className="bookings-header">
        <h1 className="page-title">My Bookings & Reservations</h1>
        <p className="page-subtitle">Track your upcoming and past trips with HomelyHub</p>
      </div>

      {actionMessage && <div className="success-alert">{actionMessage}</div>}
      {error && <div className="error-alert">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading your trips...</div>
      ) : bookings.length > 0 ? (
        <div className="bookings-list">
          {bookings.map((booking) => {
            const prop = booking.propertyId;
            const fallbackImg =
              'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80';
            const img = prop?.images && prop.images.length > 0 ? prop.images[0] : fallbackImg;

            return (
              <div key={booking._id} className="booking-card">
                <img
                  src={img}
                  alt={prop?.title || 'Stay'}
                  className="booking-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImg;
                  }}
                />
                <div className="booking-info">
                  <div className="booking-top-row">
                    <h3 className="booking-prop-title">
                      {prop ? (
                        <Link to={`/properties/${prop._id}`}>{prop.title}</Link>
                      ) : (
                        'Property Listing'
                      )}
                    </h3>
                    <span className={`status-pill status-${booking.status}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="booking-meta-row">
                    {prop?.location && (
                      <span className="booking-meta-item">
                        <MapPin size={16} /> {prop.location}
                      </span>
                    )}
                    <span className="booking-meta-item">
                      <Calendar size={16} /> {formatDate(booking.checkInDate)} —{' '}
                      {formatDate(booking.checkOutDate)}
                    </span>
                  </div>

                  <div className="booking-bottom-row">
                    <div className="booking-total-price">
                      <span>Total Paid / Due:</span>
                      <strong>${booking.totalPrice}</strong>
                    </div>

                    <div className="booking-actions">
                      {prop && (
                        <Link to={`/properties/${prop._id}`} className="btn-view-prop">
                          View Property
                        </Link>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="btn-cancel-booking"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Calendar size={48} className="empty-icon" />
          <h3>No bookings found yet</h3>
          <p>You haven't made any reservations yet. Start exploring great destinations!</p>
          <Link to="/properties" className="btn-primary">
            Explore Properties
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookings;

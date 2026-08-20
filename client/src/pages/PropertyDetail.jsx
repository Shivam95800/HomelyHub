import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, CheckCircle2, Shield, ArrowLeft, User, Star } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking Form State
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [totalNights, setTotalNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        if (response.data && response.data.data) {
          setProperty(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Calculate nights and price dynamically
  useEffect(() => {
    if (checkInDate && checkOutDate && property) {
      const inDate = new Date(checkInDate);
      const outDate = new Date(checkOutDate);
      if (outDate > inDate) {
        const diffTime = Math.abs(outDate - inDate);
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setTotalNights(nights);
        setTotalPrice(nights * property.price);
      } else {
        setTotalNights(0);
        setTotalPrice(0);
      }
    }
  }, [checkInDate, checkOutDate, property]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBookingSuccess('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/properties/${id}` } } });
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setError('Please select both check-in and check-out dates');
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await api.post('/bookings', {
        propertyId: id,
        checkInDate,
        checkOutDate,
      });

      if (response.data && response.data.success) {
        setBookingSuccess('Booking confirmed successfully! Redirecting to My Bookings...');
        setTimeout(() => {
          navigate('/my-bookings');
        }, 1800);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading stay details...</div>;
  if (error && !property) return <div className="error-message">{error}</div>;
  if (!property) return <div className="error-message">Property not found</div>;

  const fallbackImage = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80';
  const mainImage = property.images && property.images.length > 0 ? property.images[0] : fallbackImage;

  return (
    <div className="property-detail-page">
      <Link to="/properties" className="back-link">
        <ArrowLeft size={16} /> Back to all listings
      </Link>

      <div className="detail-header">
        <h1 className="detail-title">{property.title}</h1>
        <div className="detail-meta">
          <span className="meta-item">
            <MapPin size={16} /> {property.location}
          </span>
          <span className="meta-item">
            <Star size={16} fill="#f59e0b" color="#f59e0b" /> 4.9 (38 reviews)
          </span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="detail-gallery">
        <img
          src={mainImage}
          alt={property.title}
          className="gallery-main-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />
        {property.images && property.images.length > 1 && (
          <div className="gallery-thumbs">
            {property.images.slice(1, 4).map((img, idx) => (
              <img key={idx} src={img} alt={`Thumb ${idx}`} className="gallery-thumb" />
            ))}
          </div>
        )}
      </div>

      {/* Main Layout: Left info, Right booking widget */}
      <div className="detail-layout">
        <div className="detail-left">
          <div className="detail-card">
            <h3>About this place</h3>
            <p className="detail-description">{property.description}</p>
          </div>

          <div className="detail-card">
            <h3>Amenities offered</h3>
            <div className="amenities-grid">
              {property.amenities && property.amenities.length > 0 ? (
                property.amenities.map((item, idx) => (
                  <div key={idx} className="amenity-badge">
                    <CheckCircle2 size={16} color="#10b981" />
                    <span>{item}</span>
                  </div>
                ))
              ) : (
                <div className="amenity-badge">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Wi-Fi, Air Conditioning, Kitchen, Free Parking</span>
                </div>
              )}
            </div>
          </div>

          <div className="detail-card host-card">
            <div className="host-avatar">
              <User size={24} />
            </div>
            <div>
              <h4>Hosted by {property.ownerId?.name || 'Superhost'}</h4>
              <p className="host-meta">Experienced host • 100% verified response rate</p>
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Widget */}
        <div className="detail-right">
          <div className="booking-widget">
            <div className="widget-price-header">
              <span className="price-number">${property.price}</span>
              <span className="price-unit">/ night</span>
            </div>

            {error && <div className="error-alert">{error}</div>}
            {bookingSuccess && <div className="success-alert">{bookingSuccess}</div>}

            <form onSubmit={handleBookingSubmit} className="booking-form">
              <div className="date-inputs-row">
                <div className="date-input-group">
                  <label>Check-in</label>
                  <input
                    type="date"
                    value={checkInDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                  />
                </div>
                <div className="date-input-group">
                  <label>Check-out</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    min={checkInDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {totalNights > 0 && (
                <div className="price-breakdown">
                  <div className="breakdown-row">
                    <span>${property.price} x {totalNights} night{totalNights > 1 ? 's' : ''}</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Service & cleaning fee</span>
                    <span>$0 (Free)</span>
                  </div>
                  <div className="breakdown-total">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className="btn-book-now"
              >
                {bookingLoading
                  ? 'Processing Reservation...'
                  : isAuthenticated
                  ? '⚡ Reserve / Book Now'
                  : 'Log in to Reserve'}
              </button>
            </form>

            <div className="widget-guarantee">
              <Shield size={16} />
              <span>You won't be charged extra fees. Instant confirmation.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;

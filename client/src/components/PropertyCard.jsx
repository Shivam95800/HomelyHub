import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Star } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80';
  const displayImage = property.images && property.images.length > 0 ? property.images[0] : fallbackImage;

  return (
    <Link to={`/properties/${property._id}`} className="property-card">
      <div className="property-card-image-wrapper">
        <img
          src={displayImage}
          alt={property.title}
          className="property-card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />
        <span className="property-card-badge">${property.price} / night</span>
      </div>
      <div className="property-card-content">
        <div className="property-card-location">
          <MapPin size={16} />
          <span>{property.location}</span>
        </div>
        <h3 className="property-card-title">{property.title}</h3>
        <p className="property-card-desc">
          {property.description?.length > 80
            ? `${property.description.substring(0, 80)}...`
            : property.description}
        </p>
        <div className="property-card-footer">
          <div className="property-card-rating">
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <span>4.9 (24)</span>
          </div>
          <span className="btn-view-details">View Details &rarr;</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;

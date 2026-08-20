import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Sparkles, Shield, Award, HeartHandshake } from 'lucide-react';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/properties');
        if (response.data && response.data.data) {
          // Take first 6 as featured
          setFeaturedProperties(response.data.data.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/properties');
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">
            <Sparkles size={16} /> Discover Extraordinary Stays
          </span>
          <h1 className="hero-title">
            Feel at Home, <br />
            <span className="text-gradient">Anywhere in the World</span>
          </h1>
          <p className="hero-subtitle">
            Book unique villas, cozy apartments, and countryside cottages verified for comfort and quality.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hero-search-bar">
            <div className="search-input-group">
              <MapPin size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Where do you want to stay? (e.g., Goa, Mumbai, Manali)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn-search">
              <Search size={18} />
              <span>Search Stays</span>
            </button>
          </form>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="features-strip">
        <div className="feature-item">
          <Shield className="feature-icon" size={28} />
          <div>
            <h4>Verified Properties</h4>
            <p>Every home meets strict cleanliness and quality standards.</p>
          </div>
        </div>
        <div className="feature-item">
          <Award className="feature-icon" size={28} />
          <div>
            <h4>Transparent Pricing</h4>
            <p>No hidden fees, accurate per-night calculations.</p>
          </div>
        </div>
        <div className="feature-item">
          <HeartHandshake className="feature-icon" size={28} />
          <div>
            <h4>Instant Confirmation</h4>
            <p>Direct host verification with real-time overlap protection.</p>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="featured-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Stays</h2>
            <p className="section-subtitle">Hand-picked destinations popular among our travelers</p>
          </div>
          <Link to="/properties" className="btn-view-all">
            View All Properties &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading stays...</div>
        ) : featuredProperties.length > 0 ? (
          <div className="properties-grid">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No properties listed yet. Explore all listings or be the first to host!</p>
            <Link to="/properties" className="btn-primary">
              Explore All
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

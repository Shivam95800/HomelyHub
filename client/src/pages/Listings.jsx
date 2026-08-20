import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, DollarSign, Filter, RotateCcw } from 'lucide-react';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {};
      if (location) params.location = location;
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await api.get('/properties', { params });
      if (response.data && response.data.data) {
        setProperties(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (location) params.location = location;
    if (search) params.search = search;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setLocation('');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="listings-page">
      <div className="listings-header">
        <h1 className="page-title">Explore All Stays</h1>
        <p className="page-subtitle">Find the best hand-picked stays tailored to your budget and travel style</p>
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={handleFilterSubmit} className="filters-container">
        <div className="filter-field">
          <label>Keyword / Title</label>
          <div className="input-with-icon">
            <Search size={16} />
            <input
              type="text"
              placeholder="e.g. Villa, Cabin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-field">
          <label>Destination / City</label>
          <div className="input-with-icon">
            <MapPin size={16} />
            <input
              type="text"
              placeholder="e.g. Goa, Mumbai..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-field">
          <label>Min Price ($)</label>
          <div className="input-with-icon">
            <DollarSign size={16} />
            <input
              type="number"
              min="0"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-field">
          <label>Max Price ($)</label>
          <div className="input-with-icon">
            <DollarSign size={16} />
            <input
              type="number"
              min="0"
              placeholder="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button type="submit" className="btn-filter-apply">
            <Filter size={16} />
            <span>Apply</span>
          </button>
          <button type="button" onClick={handleResetFilters} className="btn-filter-reset" title="Reset Filters">
            <RotateCcw size={16} />
          </button>
        </div>
      </form>

      {/* Listings Grid */}
      {loading ? (
        <div className="loading-spinner">Searching stays...</div>
      ) : properties.length > 0 ? (
        <div className="properties-grid">
          {properties.map((prop) => (
            <PropertyCard key={prop._id} property={prop} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No properties found matching your criteria</h3>
          <p>Try resetting filters or adjusting your price and location range.</p>
          <button onClick={handleResetFilters} className="btn-primary">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Listings;

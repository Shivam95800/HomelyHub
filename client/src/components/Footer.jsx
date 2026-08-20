import React from 'react';
import { Home, Heart, Globe, Shield, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <Home size={24} className="footer-logo-icon" />
              <span>HomelyHub</span>
            </div>
            <p className="footer-desc">
              Your trusted partner for memorable vacations, long stays, and unique properties worldwide.
            </p>
            <div className="footer-meta-pill">
              <Globe size={14} /> English (US) • USD ($)
            </div>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/#">Help Center</Link></li>
              <li><Link to="/#">AirCover Guarantee</Link></li>
              <li><Link to="/#">Anti-discrimination</Link></li>
              <li><Link to="/#">Cancellation options</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Hosting</h4>
            <ul>
              <li><Link to="/signup">HomelyHub your home</Link></li>
              <li><Link to="/#">Hosting resources</Link></li>
              <li><Link to="/#">Community forum</Link></li>
              <li><Link to="/#">Host responsibly</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>HomelyHub</h4>
            <ul>
              <li><Link to="/#">Newsroom</Link></li>
              <li><Link to="/#">New features</Link></li>
              <li><Link to="/#">Careers</Link></li>
              <li><Link to="/#">Investors</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} HomelyHub, Inc. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/#">Privacy</Link>
            <span>•</span>
            <Link to="/#">Terms</Link>
            <span>•</span>
            <Link to="/#">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

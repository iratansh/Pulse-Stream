import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from "./Footer";
import React from 'react';
import { FaSearch, FaPaintBrush, FaLightbulb, FaSeedling, FaUtensils, FaBuilding } from 'react-icons/fa';
import "./LandingPage.css";

// Mock data 
const industries = [
  { name: 'Technology', icon: <FaPaintBrush />, logos: ['Abstract Circuits', 'Pixel Cloud', 'Binary Flow'] },
  { name: 'Food & Beverage', icon: <FaUtensils />, logos: ['Fresh Bites', 'Urban Grill', 'Golden Spoon'] },
  { name: 'Construction', icon: <FaBuilding />, logos: ['Solid Foundations', 'Iron Beam Co', 'Peak Structures'] },
  { name: 'Sustainability', icon: <FaSeedling />, logos: ['Eco Pulse', 'Green Horizon', 'Nature Cycle'] },
  { name: 'Startups', icon: <FaLightbulb />, logos: ['Launch Pad', 'Idea Forge', 'Next Chapter'] },
];

export default function LogoIdeas() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const filteredIndustries = industries.filter(industry =>
    industry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="hero-wrapper">
      <Navbar />
      <main className="content-container" style={{ padding: '4rem 0' }}>
        {/* Inspiration Header */}
        <section className="text-container" style={{ marginBottom: '4rem' }}>
          <h1 className="heading" style={{ fontSize: '2.75rem' }}>Logo Inspiration Gallery</h1>
          <p className="description" style={{ maxWidth: '800px' }}>
            Explore {industries.length}+ industry-specific logo concepts and design strategies. 
            Filter by category or search for your niche to spark creativity.
          </p>
        </section>

        {/* Search Section */}
        <section style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <div className="example-item" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
              <FaSearch style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                type="text"
                placeholder="Search industries (e.g., 'Tech', 'Food')"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                }}
                className="search-input"
              />
            </div>
            <p className="description" style={{ color: '#64748b' }}>
              Popular searches: Technology, Restaurants, Healthcare, Fashion
            </p>
          </div>
        </section>

        {/* Industry Grid */}
        <section style={{ padding: '2rem 0' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            {filteredIndustries.map((industry, index) => (
              <div 
                key={index}
                className="example-item" 
                style={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  textAlign: 'center'
                }}
                onClick={() => setSelectedIndustry(industry)}
              >
                <div className="icon-container" style={{ 
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  margin: '0 auto 1rem',
                  width: '80px',
                  height: '80px'
                }}>
                  {React.cloneElement(industry.icon, { 
                    style: { color: 'white', fontSize: '2rem' } 
                  })}
                </div>
                <h3 className="section-subtitle" style={{ marginBottom: '1rem' }}>
                  {industry.name}
                </h3>
                <div style={{ padding: '0 1rem' }}>
                  {industry.logos.map((logo, idx) => (
                    <div key={idx} className="description" style={{
                      padding: '0.5rem',
                      margin: '0.25rem 0',
                      background: '#f8fafc',
                      borderRadius: '6px'
                    }}>
                      {logo}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredIndustries.length === 0 && (
            <div className="text-container" style={{ marginTop: '2rem' }}>
              <p className="description" style={{ color: '#64748b' }}>
                No industries found for "{searchTerm}". Try searching broader categories.
              </p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="examples-wrapper" style={{ background: 'transparent', padding: '4rem 0' }}>
          <div className="example-item" style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: 'white'
          }}>
            <h2 className="section-title" style={{ color: 'white', marginBottom: '1.5rem' }}>
              Ready to Create Your Logo?
            </h2>
            <p className="description" style={{ color: '#e0f2fe', marginBottom: '2rem' }}>
              Turn inspiration into reality with our AI-powered logo maker
            </p>
            <button 
              className="primary-button"
              onClick={() => navigate('/logo-maker')}
              style={{ 
                background: 'white',
                color: '#3b82f6',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}
            >
              Start Designing Now
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

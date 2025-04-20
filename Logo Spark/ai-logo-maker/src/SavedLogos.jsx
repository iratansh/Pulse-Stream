import { useState } from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  FaTrash, FaDownload, FaSave, FaCoffee, 
  FaRocket, FaLeaf, FaGem, FaDragon, 
  FaFeather, FaApple, FaAndroid
} from 'react-icons/fa';
import "./LandingPage.css";

const initialLogos = [
  { id: 1, icon: FaCoffee },
  { id: 2, icon: FaRocket },
  { id: 3, icon: FaLeaf },
  { id: 4, icon: FaGem },
  { id: 5, icon: FaDragon },
  { id: 6, icon: FaFeather },
  { id: 7, icon: FaApple },
  { id: 8, icon: FaAndroid },
];

export default function SavedLogos() {
  const [logos, setLogos] = useState(initialLogos);
  const [selectedLogo, setSelectedLogo] = useState(null);

  const handleLogoClick = (id) => {
    setSelectedLogo(selectedLogo === id ? null : id);
  };

  const handleRemove = (id) => {
    setLogos(logos.filter(logo => logo.id !== id));
    setSelectedLogo(null);
  };

  const handleDownload = (id) => {
    console.log('Downloading logo', id);
    setSelectedLogo(null);
  };

  return (
    <div className="hero-wrapper">
      <Navbar />
      <main className="content-container" style={{ padding: '4rem 0' }}>
        <section style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '0 20px'
          }}>
            <h1 className="heading" style={{ fontSize: '2.25rem' }}>
              Saved Logos
            </h1>
            <p className="description" style={{ color: '#64748b' }}>
              {logos.length} logos saved in your collection
            </p>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            padding: '0 20px'
          }}>
            {logos.map((logo) => (
              <div 
                key={logo.id}
                style={{ 
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease'
                }}
                onClick={() => handleLogoClick(logo.id)}
              >
                <div className="example-item" style={{ 
                  padding: '2rem',
                  textAlign: 'center',
                  height: '250px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <logo.icon style={{ 
                    fontSize: '5rem', 
                    color: '#3b82f6',
                    transition: 'transform 0.3s ease'
                  }} />
                </div>

                {selectedLogo === logo.id && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(59, 130, 246, 0.9)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    padding: '1rem'
                  }}>
                    <button
                      onClick={() => handleDownload(logo.id)}
                      className="primary-button"
                      style={{
                        width: '100%',
                        background: 'white',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FaDownload />
                      Download
                    </button>
                    <button
                      onClick={() => handleRemove(logo.id)}
                      className="primary-button"
                      style={{
                        width: '100%',
                        background: 'white',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FaTrash />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {logos.length === 0 && (
            <div className="text-container" style={{ marginTop: '2rem', textAlign: 'center' }}>
              <p className="description" style={{ color: '#64748b' }}>
                No saved logos yet. Start saving your favorite designs!
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
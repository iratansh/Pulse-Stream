import { useState, useEffect, useRef } from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { 
  FaApple, FaAndroid, FaWindows, FaDragon, 
  FaFeather, FaRocket, FaLeaf, FaGem, FaCoffee,
  FaDownload, FaSave, FaSyncAlt
} from 'react-icons/fa';
import "./LandingPage.css";

const allIcons = [
  FaApple, FaAndroid, FaWindows, FaDragon, 
  FaFeather, FaRocket, FaLeaf, FaGem, FaCoffee
];

export default function Dashboard() {
  const [logos, setLogos] = useState(
    Array(9).fill(null).map((_, i) => ({
      id: i,
      icon: allIcons[i],
      isSelected: false
    }))
  );
  
  const gridRef = useRef(null);

  useEffect(() => {
    // Add event listener to handle clicks outside of logos
    const handleClickOutside = (event) => {
      // If we clicked outside the grid or on the grid container itself (but not on any logo)
      if (gridRef.current && gridRef.current.contains(event.target) && 
          event.target === gridRef.current) {
        // Close all menus
        setLogos(prevLogos => 
          prevLogos.map(logo => ({
            ...logo,
            isSelected: false
          }))
        );
      }
    };

    // Add global click listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoClick = (id) => {
    setLogos(logos.map(logo => ({
      ...logo,
      isSelected: logo.id === id ? !logo.isSelected : false
    })));
  };

  const refreshLogos = () => {
    const shuffled = [...allIcons].sort(() => Math.random() - 0.5);
    setLogos(Array(9).fill(null).map((_, i) => ({
      id: i,
      icon: shuffled[i],
      isSelected: false
    })));
  };

  const handleDownload = (e, id) => {
    e.stopPropagation(); // Prevent triggering the parent div's onClick
    console.log('Downloading logo', id);
  };

  const handleSave = (e, id) => {
    e.stopPropagation(); // Prevent triggering the parent div's onClick
    console.log('Saving logo to database', id);
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
              Generated Logos
            </h1>
            <button 
              onClick={refreshLogos}
              className="primary-button"
              style={{ 
                padding: '0.75rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FaSyncAlt />
              Refresh Logos
            </button>
          </div>

          <div 
            ref={gridRef}
            style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              padding: '0 20px'
            }}
          >
            {logos.map((logo) => (
              <div 
                key={logo.id}
                style={{ 
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogoClick(logo.id);
                }}
              >
                <div className="example-item" style={{ 
                  padding: '2rem',
                  textAlign: 'center',
                  height: '250px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {logo.icon && <logo.icon style={{ 
                    fontSize: '5rem', 
                    color: '#3b82f6',
                    transition: 'transform 0.3s ease'
                  }} />}
                </div>

                {logo.isSelected && (
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
                      onClick={(e) => handleDownload(e, logo.id)}
                      className="primary-button"
                      style={{
                        width: '100%',
                        background: 'white',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FaDownload />
                      Download
                    </button>
                    <button
                      onClick={(e) => handleSave(e, logo.id)}
                      className="primary-button"
                      style={{
                        width: '100%',
                        background: 'white',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FaSave />
                      Save to Account
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
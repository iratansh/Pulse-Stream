import { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  FaTrash, FaDownload
} from 'react-icons/fa';
import "./LandingPage.css";

export default function SavedLogos() {
  const [logos, setLogos] = useState([]);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogoClick = (id) => {
    setSelectedLogo(selectedLogo === id ? null : id);
  };

  const handleRemove = async (id) => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/saving/remove-image/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        // Remove the logo from state and clear the selected logo
        setLogos(logos.filter(logo => logo.id !== id));
        setSelectedLogo(null);
      } else {
        // Handle error response from the API
        const error = await response.json();
        console.error('Error removing logo:', error);
        alert('Failed to remove logo. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while removing the logo.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = (id) => {
    console.log('Downloading logo', id);
    setSelectedLogo(null);
  };     

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/saving/saved-images', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setLogos(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchLogos();
  }, []);

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
                <img
                  src={logo.imagePath}
                  alt={logo.name}
                  style={{ width: '100%', height: '250px', objectFit: 'contain' }}
                />

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
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the logo click event
                        handleRemove(logo.id);
                      }}
                      className="primary-button"
                      style={{
                        width: '100%',
                        background: 'white',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      disabled={isDeleting}
                    >
                      <FaTrash />
                      {isDeleting ? 'Removing...' : 'Remove'}
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
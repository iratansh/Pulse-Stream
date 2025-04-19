import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaAws, FaCoffee, FaHackerNews, FaLightbulb, FaMagic } from 'react-icons/fa';
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

export default function LogoMaker() {
    const navigate = useNavigate();

    async function generateLogo(input) {
        try {
            const response = await fetch('http://localhost:5080/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error generating logo:', error);
            return null;
        }
    }


    return (
        <div className="hero-wrapper">
            <Navbar />
            <main className="content-container" style={{ padding: '4rem 0' }}>
                {/* Title Section */}
                <section className="text-container" style={{ marginBottom: '4rem' }}>
                    <h1 className="heading" style={{ fontSize: '2.75rem' }}>Logo Maker</h1>
                    <p className="description" style={{ maxWidth: '600px' }}>
                        Logo Spark combines Artificial Intelligence and Machine Learning to generate unique and creative logos for your brand.
                    </p>
                </section>

                {/* Generation Form */}
                <section style={{ marginBottom: '6rem', textAlign: 'center' }}>
                    <div className="text-container" style={{ marginBottom: '2rem' }}>
                        <h2 className="section-subtitle">Enter your Company Name</h2>
                    </div>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <input 
                            type="text" 
                            id="idea-input" 
                            className="logo-ideas"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                marginBottom: '1.5rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                transition: 'border-color 0.3s ease',
                            }}
                            placeholder="Company name..."
                        />
                        <button 
                            type="submit" 
                            className="primary-button"
                            style={{ 
                                width: '100%',
                                maxWidth: '200px',
                                fontSize: '1.1rem',
                                padding: '1rem 2rem'
                            }}

                            onClick={() => navigate('/dashboard')}
                        >
                            Generate Logo
                        </button>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="examples-wrapper" style={{ background: 'transparent', padding: '4rem 0' }}>
                    <h2 className="section-title">Why Choose Logo Spark?</h2>
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 20px'
                    }}>
                        {/* Feature 1 */}
                        <div className="example-item" style={{ margin: 0 }}>
                            <div className="icon-container" style={{ 
                                background: '#3b82f6',
                                margin: '0 auto 1.5rem',
                                width: '120px',
                                height: '120px'
                            }}>
                                <FaLightbulb style={{ color: 'white', fontSize: '2.5rem' }} />
                            </div>
                            <h3 className="section-subtitle" style={{ marginBottom: '1rem' }}>AI-Powered Design</h3>
                            <p className="description" style={{ fontSize: '1rem' }}>
                                Advanced algorithms create unique logos tailored to your brand identity
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="example-item" style={{ margin: 0 }}>
                            <div className="icon-container" style={{ 
                                background: '#6366f1',
                                margin: '0 auto 1.5rem',
                                width: '120px',
                                height: '120px'
                            }}>
                                <FaMagic style={{ color: 'white', fontSize: '2.5rem' }} />
                            </div>
                            <h3 className="section-subtitle" style={{ marginBottom: '1rem' }}>Instant Generation</h3>
                            <p className="description" style={{ fontSize: '1rem' }}>
                                Get professional logo designs in minutes, not days
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="example-item" style={{ margin: 0 }}>
                            <div className="icon-container" style={{ 
                                background: '#4b5563',
                                margin: '0 auto 1.5rem',
                                width: '120px',
                                height: '120px'
                            }}>
                                <FaAws style={{ color: 'white', fontSize: '2.5rem' }} />
                            </div>
                            <h3 className="section-subtitle" style={{ marginBottom: '1rem' }}>Cloud Storage</h3>
                            <p className="description" style={{ fontSize: '1rem' }}>
                                Securely store and access your designs anywhere
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    )
}
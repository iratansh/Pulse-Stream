import Navbar from "./Navbar";
import Footer from "./Footer";
import arrowImage from "./assets/generated_logos/arrow.png";
import balloonImage from "./assets/generated_logos/balloon.png";
import explosionImage from "./assets/generated_logos/explosion.png";
import someStuffImage from "./assets/generated_logos/some_stuff.png";
import "./LandingPage.css";

export default function Documentation() {
    return (
        <div className="hero-wrapper">
            <Navbar />
            <main className="content-container" style={{ padding: '4rem 0' }}>
                {/* Title Section */}
                <section className="text-container" style={{ marginBottom: '4rem' }}>
                    <h1 className="heading" style={{ fontSize: '2.75rem' }}>How It Works</h1>
                    <p className="description" style={{ maxWidth: '800px' }}>
                        Logo Spark utilizes a specially trained AI model to generate unique and creative logos for your brand. 
                        Once created, use your logo across all marketing channels. Let Logo Spark jumpstart your brand's success today!
                    </p>
                </section>

                {/* Process Steps */}
                <section className="examples-wrapper" style={{ background: 'transparent', padding: '4rem 0' }}>
                    {[1, 2, 3, 4].map((step, index) => (
                        <div key={step} className="example-item" style={{ margin: '3rem 0' }}>
                            <div className={`example-content ${index % 2 !== 0 ? 'reverse' : ''}`}>
                                {/* Icon Container */}
                                <div className="icon-container" style={{ 
                                    background: `linear-gradient(135deg, ${index % 2 === 0 ? '#3b82f6' : '#6366f1'}, #4b5563)`,
                                    flex: '0 0 300px',
                                    height: '200px',
                                    margin: index % 2 === 0 ? '0 2rem 0 0' : '0 0 0 2rem'
                                }}>
                                    {index === 0 && <img src={ arrowImage } alt="Arrow Image" className="example-icon"/> }
                                    {index === 1 && <img src={ balloonImage } alt="Balloon Image" className="example-icon"/> }
                                    {index === 2 && <img src={ explosionImage } alt="Explosion Image" className="example-icon"/> }
                                    {index === 3 && <img src={ someStuffImage } alt="Some Stuff Image" className="example-icon"/> }
                                </div>

                                {/* Text Content */}
                                <div className="text-container" style={{ flex: 1 }}>
                                    <h3 className="section-subtitle" style={{ 
                                        fontSize: '1.5rem',
                                        color: '#1e293b',
                                        marginBottom: '1rem'
                                    }}>
                                        {getStepTitle(index)}
                                    </h3>
                                    <p className="description" style={{ 
                                        fontSize: '1.1rem',
                                        lineHeight: '1.6',
                                        color: '#64748b'
                                    }}>
                                        {getStepDescription(index)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
            <Footer />
        </div>
    )

    function getStepTitle(index) {
        return [
            "1. Design Inspiration",
            "2. Generate Logo",
            "3. Browse and Favorite Logos",
            "4. Download Logo"
        ][index];
    }

    function getStepDescription(index) {
        return [
            "Enter your company name in the search bar to get AI-powered logo suggestions. Can't decide? Use our randomizer for instant creative inspiration.",
            "Our AI engine generates professional-quality logos in under 2 minutes. Receive multiple variations tailored to your brand identity.",
            "Review and organize your generated logos. Save favorites to your personal dashboard for easy access and future modifications.",
            "Export your perfect logo in high-resolution PNG, JPEG, or SVG formats. Includes commercial licensing for immediate use."
        ][index];
    }
}
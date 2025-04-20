import { useState } from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaRocket, FaBuilding, FaCheckCircle, FaRegSmile, FaDollarSign } from "react-icons/fa";
import "./LandingPage.css";

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="hero-wrapper">
      <Navbar />
      <main className="content-container" style={{ padding: '4rem 0' }}>
        {/* Title Section */}
        <section className="text-container" style={{ marginBottom: '4rem' }}>
          <h1 className="heading" style={{ fontSize: '2.75rem' }}>Simple, Transparent Pricing</h1>
          <p className="description" style={{ maxWidth: '800px' }}>
            Choose between subscription plans or a one-time purchase. Cancel anytime.
          </p>
        </section>

        {/* Pricing Tiers */}
        <section className="examples-wrapper" style={{ background: 'transparent', padding: '4rem 0' }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            {/* Basic Tier */}
            <div 
              className={`example-item ${selectedPlan === 'starter' ? 'plan-selected' : ''}`}
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => handlePlanClick('starter')}
            >
              <div className="icon-container" style={{ 
                background: '#e5e7eb',
                margin: '0 auto 1.5rem',
                width: '80px',
                height: '80px'
              }}>
                <FaRegSmile style={{ color: '#4b5563', fontSize: '2rem' }} />
              </div>
              <h3 className="section-subtitle">Starter</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', margin: '1rem 0' }}>
                $0<span style={{ fontSize: '1rem', color: '#64748b' }}>/month</span>
              </div>
              <ul style={{ textAlign: 'left', padding: '0 1.5rem' }}>
                <li className="description"><FaCheckCircle style={{ color: '#3b82f6', marginRight: '0.5rem' }} />3 Logo Generations/Month</li>
                <li className="description"><FaCheckCircle style={{ color: '#3b82f6', marginRight: '0.5rem' }} />PNG Format</li>
                <li className="description"><FaCheckCircle style={{ color: '#3b82f6', marginRight: '0.5rem' }} />Basic Templates</li>
              </ul>
              <button className="primary-button" style={{ marginTop: '2rem', width: '100%' }}>
                Get Started Free
              </button>
            </div>

            {/* One-Time Tier */}
            <div
              className={`example-item ${selectedPlan === 'single' ? 'plan-selected' : ''}`}
              style={{ 
                textAlign: 'center',
                cursor: 'pointer',
                border: selectedPlan === 'single' ? '2px solid #10b981' : '2px solid transparent'
              }}
              onClick={() => handlePlanClick('single')}
            >
              <div className="icon-container" style={{ 
                background: 'linear-gradient(135deg, #10b981, #059669)',
                margin: '0 auto 1.5rem',
                width: '80px',
                height: '80px'
              }}>
                <FaDollarSign style={{ color: 'white', fontSize: '2rem' }} />
              </div>
              <h3 className="section-subtitle">Single Logo</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', margin: '1rem 0' }}>
                $49
              </div>
              <ul style={{ textAlign: 'left', padding: '0 1.5rem' }}>
                <li className="description"><FaCheckCircle style={{ color: '#3b82f6', marginRight: '0.5rem' }} />One Premium Logo</li>
                <li className="description"><FaCheckCircle style={{ color: '#3b82f6', marginRight: '0.5rem' }} />All File Formats</li>
                <li className="description"><FaCheckCircle style={{ color: '#3b82f6', marginRight: '0.5rem' }} />Commercial License</li>
                <li className="description"><FaCheckCircle style={{ color: '#3b82f6', marginRight: '0.5rem' }} />30-day Support</li>
              </ul>
              <button className="primary-button" style={{ 
                marginTop: '2rem', 
                width: '100%',
                background: '#10b981'
              }}>
                Purchase Now
              </button>
            </div>

            {/* Pro Tier */}
            <div 
              className={`example-item ${selectedPlan === 'pro' ? 'plan-selected' : ''}`}
              style={{ 
                textAlign: 'center',
                cursor: 'pointer',
                border: selectedPlan === 'pro' ? '2px solid #3b82f6' : '2px solid transparent'
              }}
              onClick={() => handlePlanClick('pro')}
            >
              <div className="icon-container" style={{ 
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                margin: '0 auto 1.5rem',
                width: '80px',
                height: '80px'
              }}>
                <FaRocket style={{ color: 'white', fontSize: '2rem' }} />
              </div>
              <h3 className="section-subtitle">Professional</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', margin: '1rem 0' }}>
                $29<span style={{ fontSize: '1rem', color: '#64748b' }}>/month</span>
              </div>
              <ul style={{ textAlign: 'left', padding: '0 1.5rem' }}>
                <li className="description"><FaCheckCircle style={{ color: '#3b82f6', marginRight: '0.5rem' }} />Unlimited Generations</li>
                <li className="description"><FaCheckCircle style={{ color: '#3b82f6', marginRight: '0.5rem' }} />All File Formats</li>
                <li className="description"><FaCheckCircle style={{ color: '#3b82f6', marginRight: '0.5rem' }} />Premium Templates</li>
                <li className="description"><FaCheckCircle style={{ color: '#3b82f6', marginRight: '0.5rem' }} />Priority Support</li>
              </ul>
              <button className="primary-button" style={{ 
                marginTop: '2rem', 
                width: '100%',
                background: '#3b82f6'
              }}>
                Start Free Trial
              </button>
            </div>
          </div>

          {/* Add some styling to highlight the selected plan */}
          <style jsx>{`
            .plan-selected {
              transform: translateY(-10px);
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;
            }
            
            .example-item {
              transition: all 0.3s ease;
            }
          `}</style>

          {/* FAQ Section */}
          <section style={{ maxWidth: '800px', margin: '4rem auto 0', padding: '0 20px' }}>
            <h3 className="section-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              Frequently Asked Questions
            </h3>
            <div className="example-item" style={{ margin: '1rem 0' }}>
              <div className="description" style={{ fontWeight: '600' }}>Can I switch plans later?</div>
              <p className="description">Yes, you can upgrade, downgrade, or switch to one-time purchases at any time.</p>
            </div>
            <div className="example-item" style={{ margin: '1rem 0' }}>
              <div className="description" style={{ fontWeight: '600' }}>What's included in the one-time purchase?</div>
              <p className="description">Get 1 premium logo with all file formats and commercial rights. Perfect for businesses needing a single professional logo.</p>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
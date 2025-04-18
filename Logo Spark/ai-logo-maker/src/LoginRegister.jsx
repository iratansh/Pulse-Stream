import { lazy, useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./LandingPage.css";
import './LoginRegister.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords must match';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form data:', formData);

      if (isLogin) {

        // Handle login
        console.log('Logging in...');
        const response = await axios.post('http://localhost:5173/api/auth/login', {
            username: formData.username,
            password: formData.password
        });

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        console.log(response.data);

      } else {
        // Handle registration
        console.log('Registering...');
        const firstName = formData.name.split(' ')[0];
        const lastName = formData.name.split(' ')[1];
        const response = await axios.post('http://localhost:5173/api/auth/register', {
            username: formData.username,
            firstName: firstName,
            lastName: lastName,
            password: formData.password
        });

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        console.log(response.data);
      }
    }
  };

  return (
    <div className="hero-wrapper">
      <Navbar />
      <main className="content-container" style={{ padding: '4rem 0' }}>
        <section className="text-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="example-item" style={{ padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 className="heading" style={{ fontSize: '2rem' }}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="description" style={{ color: '#64748b' }}>
                {isLogin ? 'Sign in to continue' : 'Join our community today'}
              </p>
            </div>

            {/* Auth Toggle */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <button
                onClick={() => setIsLogin(true)}
                style={{
                  background: isLogin ? '#3b82f6' : '#f1f5f9',
                  color: isLogin ? 'white' : '#64748b',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <FaSignInAlt style={{ marginRight: '0.5rem' }} />
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                style={{
                  background: !isLogin ? '#3b82f6' : '#f1f5f9',
                  color: !isLogin ? 'white' : '#64748b',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <FaUserPlus style={{ marginRight: '0.5rem' }} />
                Register
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    color: '#64748b'
                  }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FaUser style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b'
                    }} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                        border: `2px solid ${errors.name ? '#ef4444' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                      placeholder="John Smith"
                    />
                  </div>
                  {errors.name && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.name}</span>}
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#64748b'
                }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <FaUser style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b'
                  }} />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      border: `2px solid ${errors.username ? '#ef4444' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="username"
                  />
                </div>
                {errors.username && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.username}</span>}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#64748b'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <FaLock style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b'
                  }} />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      border: `2px solid ${errors.password ? '#ef4444' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.password}</span>}
              </div>

              {!isLogin && (
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    color: '#64748b'
                  }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FaLock style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b'
                    }} />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                        border: `2px solid ${errors.confirmPassword ? '#ef4444' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.confirmPassword}</span>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="primary-button"
                style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
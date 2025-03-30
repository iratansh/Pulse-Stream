import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaArrowRight, FaCalendarAlt, FaTags } from 'react-icons/fa';
import "./LandingPage.css";

const articles = [
  {
    id: 1,
    title: "5 Ways Logo Spark Transforms Brand Identity",
    excerpt: "Discover how AI-powered logo design can elevate your brand presence in competitive markets...",
    category: "Logo Spark",
    date: "March 15, 2024",
    slug: "logo-spark-brand-identity",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Essential Steps for Launching Your Startup",
    excerpt: "From business registration to brand development - a comprehensive guide for new entrepreneurs...",
    category: "Starting a Business",
    date: "March 12, 2024",
    slug: "launching-startup-guide",
    readTime: "8 min"
  },
  {
    id: 3,
    title: "Digital Marketing Strategies for 2024",
    excerpt: "Master social media and SEO trends with our expert analysis of emerging marketing technologies...",
    category: "Marketing",
    date: "March 10, 2024",
    slug: "2024-marketing-strategies",
    readTime: "12 min"
  }
];

export default function Blog() {
  return (
    <div className="hero-wrapper">
      <Navbar />
      <main className="content-container" style={{ padding: '4rem 0' }}>
        {/* Blog Header */}
        <section className="text-container" style={{ marginBottom: '4rem' }}>
          <h1 className="heading" style={{ fontSize: '2.75rem' }}>Logo Spark Insights</h1>
          <p className="description" style={{ maxWidth: '800px' }}>
            Expert articles on brand development, business strategy, and digital marketing trends
          </p>
        </section>

        {/* Articles Grid */}
        <section style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {articles.map(article => (
            <article 
              key={article.id}
              className="example-item" 
              style={{ 
                padding: '2rem',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
            >
              <Link to={`/blog/article/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  color: '#3b82f6'
                }}>
                  <FaTags />
                  <span className="description" style={{ fontWeight: '600' }}>
                    {article.category}
                  </span>
                </div>
                <h2 className="section-subtitle" style={{ marginBottom: '1rem' }}>
                  {article.title}
                </h2>
                <p className="description" style={{ marginBottom: '1.5rem' }}>
                  {article.excerpt}
                </p>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#64748b'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaCalendarAlt />
                    <span className="description">{article.date}</span>
                  </div>
                  <div className="description">{article.readTime} read</div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#3b82f6',
                  marginTop: '1.5rem'
                }}>
                  <span className="description" style={{ fontWeight: '600' }}>
                    Read More
                  </span>
                  <FaArrowRight />
                </div>
              </Link>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}



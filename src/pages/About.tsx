import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiAward,
  FiZap,
  FiShield,
  FiHeart,
  FiCode,
  FiLinkedin,
  FiGithub,
  FiCheckCircle
} from 'react-icons/fi';
import { RiShoppingBag3Fill } from 'react-icons/ri';

export function About() {
  const coreValues = [
    {
      icon: <FiAward />,
      title: 'Uncompromising Quality',
      desc: 'Every sneaker, computing device, and literature title in our catalog undergoes rigorous authenticity and condition verification before listing.'
    },
    {
      icon: <FiZap />,
      title: 'Friction-Free Speed',
      desc: 'From snappy client-side navigation to lightning-fast order dispatch within 24 hours, our entire platform is engineered for seamless velocity.'
    },
    {
      icon: <FiShield />,
      title: 'Absolute Buyer Security',
      desc: 'Your peace of mind is paramount. We safeguard every checkout with 256-bit encryption and back every purchase with a 30-day return policy.'
    },
    {
      icon: <FiHeart />,
      title: 'Curated with Passion',
      desc: 'No algorithmic junk or clutter. We handpick timeless lifestyle essentials that elevate your productivity, style, and personal growth.'
    }
  ];

  const techStack = [
    'React 18',
    'TypeScript 5',
    'Vite',
    'React-Bootstrap',
    'React Router v6',
    'React Icons',
    'CSS3 Glassmorphism'
  ];

  return (
    <div className="about-page-container">
      {/* 1. ABOUT HERO BANNER */}
      <section className="about-hero-section">
        <div className="hero-tag mx-auto">
          <RiShoppingBag3Fill color="#38bdf8" />
          <span>Our Story & Mission</span>
        </div>
        <h1 className="hero-title mb-3">
          Curated Essentials for the <span className="hero-gradient-text">Modern Tastemaker</span>
        </h1>
        <p className="hero-subtitle mx-auto">
          ShopCart was built to eliminate the noise in online shopping. We unite flagship mobile tech, high-performance computing, iconic street footwear, and transformative literature in one streamlined destination.
        </p>

        <div className="hero-stats-row justify-content-center">
          <div className="stat-item text-center">
            <span className="stat-number">15,000+</span>
            <span className="stat-label">Happy Shoppers</span>
          </div>
          <div className="stat-item text-center">
            <span className="stat-number">99.8%</span>
            <span className="stat-label">Customer Satisfaction</span>
          </div>
          <div className="stat-item text-center">
            <span className="stat-number">4</span>
            <span className="stat-label">Handpicked Categories</span>
          </div>
          <div className="stat-item text-center">
            <span className="stat-number">&lt; 24h</span>
            <span className="stat-label">Fast Dispatch</span>
          </div>
        </div>
      </section>

      {/* 2. THE STORY & MISSION */}
      <section className="mb-5">
        <Row className="g-4 align-items-stretch">
          <Col lg={7}>
            <div className="about-card d-flex flex-column justify-content-center">
              <span className="text-primary fw-bold small text-uppercase mb-1">
                How It Started
              </span>
              <h2 className="fs-2 fw-bold text-dark mb-3">Redefining What a Web Store Can Be</h2>
              <p className="text-secondary mb-3" style={{ lineHeight: '1.7' }}>
                Traditional online marketplaces often overwhelm users with thousands of sponsored listings, ambiguous seller ratings, and cluttered interfaces. ShopCart takes a radically different approach: <strong>extreme intentionality</strong>.
              </p>
              <p className="text-secondary mb-4" style={{ lineHeight: '1.7' }}>
                Whether you are gearing up for high-output work with a MacBook, stepping out in iconic Jordan retros, or unwinding with timeless wisdom from <em>Ikigai</em>, ShopCart ensures a joyful, ultra-fast browsing experience with zero compromises on quality.
              </p>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <Link to="/store" className="btn btn-primary px-4 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-2">
                  Explore The Collection <FiArrowRight />
                </Link>
                <Link to="/contact" className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-bold">
                  Get In Touch
                </Link>
              </div>
            </div>
          </Col>

          <Col lg={5}>
            <div
              className="p-4 h-100 rounded-4 text-white d-flex flex-column justify-content-between"
              style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div>
                <span className="badge bg-primary bg-opacity-50 text-white mb-3 px-3 py-2 rounded-pill">
                  Our Guarantee
                </span>
                <h3 className="fw-bold mb-3">100% Authentic. Guaranteed.</h3>
                <p className="small text-slate-300" style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                  We stand firmly behind every product shipped from our hubs. If you are ever unsatisfied with your order, our concierge support is ready 24/7 to make it right.
                </p>
              </div>

              <div className="pt-3 border-top border-secondary border-opacity-50">
                <div className="d-flex align-items-center gap-2 text-warning small fw-bold mb-1">
                  <FiCheckCircle color="#10b981" />
                  <span>Direct Brand Sourcing</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-warning small fw-bold mb-1">
                  <FiCheckCircle color="#10b981" />
                  <span>30-Day Hassle-Free Returns</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-warning small fw-bold">
                  <FiCheckCircle color="#10b981" />
                  <span>Safe 256-bit Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* 3. CORE VALUES & PILLARS */}
      <section className="mb-5">
        <div className="text-center mb-4">
          <span className="text-primary fw-bold text-uppercase small">What Drives Us</span>
          <h2 className="fs-2 fw-bold text-dark">Our Core Pillars</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '480px' }}>
            Built from the ground up to guarantee a superior e-commerce experience.
          </p>
        </div>

        <Row xs={1} md={2} lg={4} className="g-4">
          {coreValues.map((val, idx) => (
            <Col key={idx}>
              <div className="about-card">
                <div className="about-value-icon">{val.icon}</div>
                <h4 className="fw-bold fs-5 text-dark mb-2">{val.title}</h4>
                <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                  {val.desc}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* 4. DEVELOPER & ENGINEERING SPOTLIGHT */}
      <section className="developer-card mb-5">
        <Row className="align-items-center g-4">
          <Col lg={8} className="text-lg-start text-center">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 bg-white bg-opacity-10 rounded-pill small text-info fw-bold mb-2">
              <FiCode />
              <span>CRAFTED BY</span>
            </div>
            <h2 className="fs-1 fw-bold text-white mb-2">Hemant Mehta</h2>
            <p className="text-info fw-semibold mb-3">Front-End Developer & UI/UX Architect</p>
            <p className="text-slate-300 small mb-4" style={{ color: '#cbd5e1', maxWidth: '580px', lineHeight: '1.6' }}>
              ShopCart was designed and engineered to showcase modern web technologies, responsive layouts, dynamic state management with React Hooks & Context API, and polished user experiences.
            </p>

            {/* Tech Badges */}
            <div className="d-flex align-items-center justify-content-lg-start justify-content-center gap-2 flex-wrap mb-4">
              {techStack.map((tech, i) => (
                <span key={i} className="tech-badge-pill">
                  {tech}
                </span>
              ))}
            </div>

            <div className="d-flex align-items-center justify-content-lg-start justify-content-center gap-3">
              <Button
                variant="outline-light"
                className="rounded-pill px-3 py-2 d-flex align-items-center gap-2 fw-semibold"
                onClick={() => window.open('https://www.linkedin.com/in/hemant-mehta-97b40b220/', '_blank')}
              >
                <FiLinkedin size={16} />
                <span>LinkedIn Profile</span>
              </Button>
              <Button
                variant="outline-info"
                className="rounded-pill px-3 py-2 d-flex align-items-center gap-2 fw-semibold"
                onClick={() => window.open('https://github.com/hemantmm', '_blank')}
              >
                <FiGithub size={16} />
                <span>GitHub</span>
              </Button>
            </div>
          </Col>

          <Col lg={4} className="text-center">
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                color: 'white',
                fontSize: '3rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: 'var(--shadow-glow)',
                border: '4px solid rgba(255, 255, 255, 0.2)'
              }}
              className="d-flex align-items-center justify-content-center"
            >
              HM
            </div>
            <h5 className="text-white mt-3 mb-0 fw-bold">Hemant Mehta</h5>
            <span className="text-white-50 small">Developer & Creator</span>
          </Col>
        </Row>
      </section>
    </div>
  );
}
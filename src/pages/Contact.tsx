import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import {
  FiMail,
  FiLinkedin,
  FiGithub,
  FiClock,
  FiSend,
  FiHelpCircle,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle
} from 'react-icons/fi';
import { RiCustomerService2Fill } from 'react-icons/ri';

const faqList = [
  {
    q: 'How fast is order dispatch and delivery?',
    a: 'All orders are processed and dispatched from our fulfillment hubs within 24 business hours. Express standard delivery typically arrives in 2–4 business days with live tracking provided.'
  },
  {
    q: 'What is your return and refund policy?',
    a: 'We offer a 30-day, hassle-free return guarantee on all unworn footwear, undamaged electronics, and pristine books. Simply reach out to support to generate your return shipping label.'
  },
  {
    q: 'Which payment methods are supported at checkout?',
    a: 'We accept all major credit and debit cards (Visa, MasterCard, American Express), as well as Apple Pay and PayPal through our 256-bit encrypted secure gateway.'
  },
  {
    q: 'Are the products 100% authentic and verified?',
    a: 'Yes, absolutely. We source all inventory directly from verified brand partners and distributors. Every single product is inspected before dispatch.'
  }
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: 'general', message: '' });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="contact-container">
      {/* 1. CONTACT HERO */}
      <section className="about-hero-section mb-4">
        <div className="hero-tag mx-auto">
          <RiCustomerService2Fill color="#38bdf8" />
          <span>Support & Connect</span>
        </div>
        <h1 className="hero-title mb-3">
          We'd Love to <span className="hero-gradient-text">Hear From You</span>
        </h1>
        <p className="hero-subtitle mx-auto">
          Have a question about an order, want to give feedback, or exploring job opportunities? Our inbox is always open.
        </p>
      </section>

      {/* 2. DUAL-COLUMN CONTACT HUB */}
      <Row className="g-4 mb-5">
        {/* Left Column: Direct Channels */}
        <Col lg={5}>
          <div className="contact-card h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="text-primary fw-bold small text-uppercase mb-1">
                Direct Channels
              </span>
              <h3 className="fw-bold text-dark mb-3">Get in Touch Directly</h3>
              <p className="text-muted small mb-4" style={{ lineHeight: '1.6' }}>
                Whether you're reaching out for product support or discussing a front-end developer vacancy, we respond promptly.
              </p>

              <div className="d-flex flex-column gap-3 mb-4">
                <div className="contact-channel-box">
                  <div className="contact-channel-icon">
                    <FiMail />
                  </div>
                  <div>
                    <span className="text-muted small d-block">Direct Email</span>
                    <strong className="text-dark">hemant29mehta@gmail.com</strong>
                  </div>
                </div>

                <div
                  className="contact-channel-box"
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.open('https://www.linkedin.com/in/hemant-mehta-97b40b220/', '_blank')}
                >
                  <div className="contact-channel-icon" style={{ color: '#0a66c2' }}>
                    <FiLinkedin />
                  </div>
                  <div>
                    <span className="text-muted small d-block">Professional Profile</span>
                    <strong className="text-dark">LinkedIn / Hemant Mehta</strong>
                  </div>
                </div>

                <div
                  className="contact-channel-box"
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.open('https://github.com/hemantmm', '_blank')}
                >
                  <div className="contact-channel-icon" style={{ color: '#24292e' }}>
                    <FiGithub />
                  </div>
                  <div>
                    <span className="text-muted small d-block">GitHub Portfolio</span>
                    <strong className="text-dark">github.com/hemantmm</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-light rounded-3 border d-flex align-items-center gap-2 text-primary small fw-semibold">
              <FiClock size={18} />
              <span>Average response turnaround: &lt; 24 hours</span>
            </div>
          </div>
        </Col>

        {/* Right Column: Interactive Form */}
        <Col lg={7}>
          <div className="contact-card">
            <h3 className="fw-bold text-dark mb-1">Send Us a Message</h3>
            <p className="text-muted small mb-4">Fill out the quick form below and our team will get right back to you.</p>

            {isSubmitted && (
              <Alert variant="success" className="d-flex align-items-center gap-2 mb-4" onClose={() => setIsSubmitted(false)} dismissible>
                <FiCheckCircle size={20} className="text-success" />
                <div>
                  <strong>Message Sent Successfully!</strong> Thank you for reaching out. We will reply shortly.
                </div>
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-muted">Your Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-muted">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-muted">Inquiry Subject</Form.Label>
                    <Form.Select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="general">General Question</option>
                      <option value="order">Order Tracking & Support</option>
                      <option value="career">Career / Developer Role</option>
                      <option value="feedback">Product Feedback</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-muted">Your Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      required
                      placeholder="How can we help you today?"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Button
                    type="submit"
                    className="w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-pill"
                    style={{
                      background: 'var(--accent-gradient)',
                      border: 'none'
                    }}
                  >
                    <FiSend size={16} />
                    <span>Send Message</span>
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
      </Row>

      {/* 3. FREQUENTLY ASKED QUESTIONS */}
      <section className="mb-5">
        <div className="text-center mb-4">
          <span className="text-primary fw-bold text-uppercase small d-flex align-items-center justify-content-center gap-1">
            <FiHelpCircle />
            <span>Got Questions?</span>
          </span>
          <h2 className="fs-2 fw-bold text-dark">Frequently Asked Questions</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '480px' }}>
            Quick answers to the most common questions about orders, returns, and security.
          </p>
        </div>

        <div className="mx-auto" style={{ maxWidth: '800px' }}>
          {faqList.map((item, idx) => (
            <div key={idx} className="faq-accordion-item">
              <button
                className="faq-question-btn"
                onClick={() => toggleFaq(idx)}
                aria-expanded={openFaq === idx}
              >
                <span>{item.q}</span>
                {openFaq === idx ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {openFaq === idx && (
                <div className="faq-answer-box">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
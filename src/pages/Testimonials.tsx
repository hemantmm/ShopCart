import { Row, Col, Card } from 'react-bootstrap';
import { FiStar, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';
import { RiDoubleQuotesL } from 'react-icons/ri';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Product Designer',
    avatar: 'SJ',
    color: '#3b82f6', // blue
    rating: 5,
    date: 'August 12, 2026',
    product: 'MacBook Air M2',
    text: 'ShopCart has completely revolutionized how I buy my tech. The curated selection meant I didn\'t have to sift through endless pages of junk. Lightning fast shipping and the laptop arrived in pristine condition!'
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Sneaker Enthusiast',
    avatar: 'MC',
    color: '#f59e0b', // amber
    rating: 5,
    date: 'July 28, 2026',
    product: 'Nike Air Jordan 1',
    text: 'Authenticity is everything to me when buying sneakers. The 100% verified guarantee gave me peace of mind, and the shoes are absolutely flawless. Customer for life.'
  },
  {
    id: 3,
    name: 'Emily Roberts',
    role: 'Avid Reader',
    avatar: 'ER',
    color: '#10b981', // emerald
    rating: 4,
    date: 'September 2, 2026',
    product: 'IKIGAI: The Art of Life',
    text: 'Loved the smooth checkout experience. The book arrived perfectly packaged within 2 days. Giving 4 stars only because I wish they had an even larger book collection, but the quality is top-notch!'
  },
  {
    id: 4,
    name: 'David Okafor',
    role: 'Software Engineer',
    avatar: 'DO',
    color: '#8b5cf6', // violet
    rating: 5,
    date: 'June 15, 2026',
    product: 'iPhone 15 Pro',
    text: 'Upgraded my phone and the process couldn\'t have been easier. The 15% VIP discount from the newsletter worked flawlessly. The UI of this store is incredibly snappy and intuitive.'
  },
  {
    id: 5,
    name: 'Jessica Williams',
    role: 'Fitness Coach',
    avatar: 'JW',
    color: '#ec4899', // pink
    rating: 5,
    date: 'August 30, 2026',
    product: 'Adidas Ultraboost AIR',
    text: 'These are hands down the most comfortable running shoes I\'ve ever owned. The purchasing experience was seamless, and the 30-day return policy made it a risk-free purchase.'
  },
  {
    id: 6,
    name: 'Michael Torres',
    role: 'Digital Nomad',
    avatar: 'MT',
    color: '#14b8a6', // teal
    rating: 5,
    date: 'September 10, 2026',
    product: 'MacBook Air M2',
    text: 'As someone constantly on the move, a reliable machine is everything. Not only did I get a great deal, but the fast global dispatch meant I got my laptop exactly when I needed it.'
  }
];

export function Testimonials() {
  return (
    <div className="testimonials-page-container">
      <section className="about-hero-section mb-5 text-center">
        <div className="hero-tag mx-auto">
          <FiMessageSquare color="#38bdf8" />
          <span>Community Feedback</span>
        </div>
        <h1 className="hero-title mb-3">
          Don't Just Take <span className="hero-gradient-text">Our Word For It</span>
        </h1>
        <p className="hero-subtitle mx-auto">
          Hear from thousands of satisfied customers who have experienced the speed, quality, and simplicity of the ShopCart ecosystem.
        </p>

        <div className="d-flex align-items-center justify-content-center gap-4 mt-4 flex-wrap">
          <div className="d-flex align-items-center gap-2 bg-white px-4 py-2 rounded-pill shadow-sm border">
            <div className="d-flex text-warning">
              <FiStar fill="#f59e0b" />
              <FiStar fill="#f59e0b" />
              <FiStar fill="#f59e0b" />
              <FiStar fill="#f59e0b" />
              <FiStar fill="#f59e0b" />
            </div>
            <span className="fw-bold text-dark">4.9/5 Average</span>
          </div>
          <div className="d-flex align-items-center gap-2 bg-white px-4 py-2 rounded-pill shadow-sm border text-muted fw-semibold">
            <FiCheckCircle className="text-success" />
            15,000+ Verified Reviews
          </div>
        </div>
      </section>

      <section className="mb-5">
        <Row xs={1} md={2} lg={3} className="g-4">
          {testimonials.map((review) => (
            <Col key={review.id}>
              <Card className="h-100 border-0 shadow-sm rounded-4 testimonial-card transition-all">
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex text-warning gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} fill={i < review.rating ? '#f59e0b' : 'transparent'} color="#f59e0b" size={16} />
                      ))}
                    </div>
                    <span className="badge bg-light text-secondary border fw-normal small px-2 py-1">
                      {review.product}
                    </span>
                  </div>

                  <div className="mb-4 position-relative flex-grow-1">
                    <RiDoubleQuotesL className="position-absolute text-light" style={{ top: '-10px', left: '-10px', fontSize: '3rem', zIndex: 0, opacity: 0.5 }} />
                    <p className="text-secondary position-relative" style={{ zIndex: 1, lineHeight: '1.6', fontSize: '0.95rem' }}>
                      "{review.text}"
                    </p>
                  </div>

                  <div className="d-flex align-items-center gap-3 pt-3 border-top border-light">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                      style={{ width: '45px', height: '45px', backgroundColor: review.color, fontSize: '1.1rem' }}
                    >
                      {review.avatar}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark d-flex align-items-center gap-1">
                        {review.name}
                        <FiCheckCircle className="text-primary" size={14} title="Verified Buyer" />
                      </h6>
                      <small className="text-muted">{review.role} • {review.date}</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
}

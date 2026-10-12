import { useState, useMemo } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import {
  FiStar,
  FiCheckCircle,
  FiMessageSquare,
  FiEdit3,
  FiTrash2,
  FiSearch,
  FiX
} from 'react-icons/fi';
import { RiDoubleQuotesL } from 'react-icons/ri';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { WriteReviewModal, NewReviewPayload } from '../components/WriteReviewModal';
import { toast } from 'react-toastify';

export type ReviewItem = {
  id: string | number;
  name: string;
  role: string;
  avatar: string;
  color: string;
  rating: number;
  date: string;
  product: string;
  text: string;
  isUserSubmitted?: boolean;
};

const INITIAL_TESTIMONIALS: ReviewItem[] = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Product Designer',
    avatar: 'SJ',
    color: '#3b82f6', // blue
    rating: 5,
    date: 'August 12, 2026',
    product: 'MACBOOK AIR',
    text: "ShopCart has completely revolutionized how I buy my tech. The curated selection meant I didn't have to sift through endless pages of junk. Lightning fast shipping and the laptop arrived in pristine condition!"
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Sneaker Enthusiast',
    avatar: 'MC',
    color: '#f59e0b', // amber
    rating: 5,
    date: 'July 28, 2026',
    product: 'NIKE JORDAN',
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
    product: 'IKIGAI',
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
    product: 'IPHONE 15',
    text: "Upgraded my phone and the process couldn't have been easier. The 15% VIP discount from the newsletter worked flawlessly. The UI of this store is incredibly snappy and intuitive."
  },
  {
    id: 5,
    name: 'Jessica Williams',
    role: 'Fitness Coach',
    avatar: 'JW',
    color: '#ec4899', // pink
    rating: 5,
    date: 'August 30, 2026',
    product: 'ADIDAS AIR',
    text: "These are hands down the most comfortable running shoes I've ever owned. The purchasing experience was seamless, and the 30-day return policy made it a risk-free purchase."
  },
  {
    id: 6,
    name: 'Michael Torres',
    role: 'Digital Nomad',
    avatar: 'MT',
    color: '#14b8a6', // teal
    rating: 5,
    date: 'September 10, 2026',
    product: 'DELL INSPIRON',
    text: 'As someone constantly on the move, a reliable machine is everything. Not only did I get a great deal, but the fast global dispatch meant I got my laptop exactly when I needed it.'
  }
];

function isUserReviews(value: unknown): value is ReviewItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.role === 'string' &&
        typeof item.avatar === 'string' &&
        typeof item.color === 'string' &&
        typeof item.rating === 'number' &&
        typeof item.date === 'string' &&
        typeof item.product === 'string' &&
        typeof item.text === 'string'
    )
  );
}

export function Testimonials() {
  const [userReviews, setUserReviews] = useLocalStorage<ReviewItem[]>(
    'shopcart_user_reviews',
    [],
    isUserReviews
  );

  const [showWriteModal, setShowWriteModal] = useState<boolean>(false);
  const [filterRating, setFilterRating] = useState<number | 'all' | 'user'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Merge user reviews at the front of the list
  const allReviews: ReviewItem[] = useMemo(() => {
    return [...userReviews, ...INITIAL_TESTIMONIALS];
  }, [userReviews]);

  // Dynamically calculate average rating and stats
  const averageRating = useMemo(() => {
    if (allReviews.length === 0) return '5.0';
    const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / allReviews.length).toFixed(1);
  }, [allReviews]);

  // Handle new review submission
  const handleAddReview = (newReviewData: NewReviewPayload) => {
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const newReview: ReviewItem = {
      ...newReviewData,
      id: `user-${Date.now()}`,
      date: formattedDate,
      isUserSubmitted: true
    };

    setUserReviews((prev) => [newReview, ...prev]);
    toast.success('🎉 Thank you! Your review has been published.', {
      autoClose: 3000
    });
  };

  // Handle removing a user-submitted review
  const handleDeleteReview = (id: string | number) => {
    setUserReviews((prev) => prev.filter((r) => r.id !== id));
    toast.info('Review removed from your community posts.', {
      autoClose: 2000
    });
  };

  // Filter reviews based on rating and search input
  const filteredReviews = useMemo(() => {
    return allReviews.filter((review) => {
      // Rating / origin filter
      if (filterRating === 'user' && !review.isUserSubmitted) return false;
      if (typeof filterRating === 'number' && review.rating !== filterRating) return false;

      // Keyword search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = review.name.toLowerCase().includes(query);
        const matchesRole = review.role.toLowerCase().includes(query);
        const matchesProduct = review.product.toLowerCase().includes(query);
        const matchesText = review.text.toLowerCase().includes(query);
        return matchesName || matchesRole || matchesProduct || matchesText;
      }

      return true;
    });
  }, [allReviews, filterRating, searchQuery]);

  return (
    <div className="testimonials-page-container">
      {/* ============================================================== */}
      {/* 1. HERO SECTION                                                */}
      {/* ============================================================== */}
      <section className="about-hero-section mb-5 text-center">
        <div className="hero-tag mx-auto">
          <FiMessageSquare color="#38bdf8" />
          <span>Community Feedback</span>
        </div>
        <h1 className="hero-title mb-3">
          Don&apos;t Just Take <span className="hero-gradient-text">Our Word For It</span>
        </h1>
        <p className="hero-subtitle mx-auto">
          Hear from thousands of satisfied customers who have experienced the speed, quality, and simplicity of the ShopCart ecosystem.
        </p>

        {/* Stats Pill Badges */}
        <div className="d-flex align-items-center justify-content-center gap-3 mt-4 flex-wrap">
          <div className="d-flex align-items-center gap-2 bg-white px-4 py-2 rounded-pill shadow-sm border">
            <div className="d-flex text-warning">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  fill={i < Math.round(Number(averageRating)) ? '#f59e0b' : 'transparent'}
                  color="#f59e0b"
                />
              ))}
            </div>
            <span className="fw-bold text-dark">{averageRating}/5 Average</span>
          </div>

          <div className="d-flex align-items-center gap-2 bg-white px-4 py-2 rounded-pill shadow-sm border text-muted fw-semibold">
            <FiCheckCircle className="text-success" />
            <span>{(15000 + userReviews.length).toLocaleString()}+ Verified Reviews</span>
          </div>

          {/* Primary Call to Action */}
          <Button
            variant="primary"
            className="write-review-btn rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow"
            onClick={() => setShowWriteModal(true)}
          >
            <FiEdit3 size={17} />
            <span>Write a Review</span>
          </Button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. FILTER & SEARCH CONTROLS BAR                                 */}
      {/* ============================================================== */}
      <section className="mb-4">
        <div className="p-3 bg-white rounded-4 border shadow-sm d-flex align-items-center justify-content-between flex-wrap gap-3">
          {/* Quick Filter Pills */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              type="button"
              className={`review-filter-pill ${filterRating === 'all' ? 'active' : ''}`}
              onClick={() => setFilterRating('all')}
            >
              All ({allReviews.length})
            </button>
            <button
              type="button"
              className={`review-filter-pill ${filterRating === 5 ? 'active' : ''}`}
              onClick={() => setFilterRating(5)}
            >
              ★ 5 Stars ({allReviews.filter((r) => r.rating === 5).length})
            </button>
            <button
              type="button"
              className={`review-filter-pill ${filterRating === 4 ? 'active' : ''}`}
              onClick={() => setFilterRating(4)}
            >
              ★ 4 Stars ({allReviews.filter((r) => r.rating === 4).length})
            </button>
            {userReviews.length > 0 && (
              <button
                type="button"
                className={`review-filter-pill ${filterRating === 'user' ? 'active' : ''}`}
                onClick={() => setFilterRating('user')}
              >
                Community Posts ({userReviews.length})
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="position-relative" style={{ minWidth: '240px', maxWidth: '340px', flexGrow: 1 }}>
            <FiSearch className="position-absolute text-muted" style={{ top: '10px', left: '12px' }} />
            <Form.Control
              type="text"
              placeholder="Search reviews or products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-5 pe-4 rounded-pill form-control-sm py-2"
            />
            {searchQuery && (
              <button
                type="button"
                className="btn btn-link position-absolute p-0 text-muted border-0 d-flex align-items-center"
                style={{ top: '8px', right: '12px' }}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <FiX size={15} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. REVIEWS GRID                                                */}
      {/* ============================================================== */}
      <section className="mb-5">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
            <div className="mb-3 text-muted" style={{ fontSize: '2.5rem' }}>
              <FiMessageSquare />
            </div>
            <h4 className="fw-bold text-dark mb-2">No reviews match your filters</h4>
            <p className="text-muted mb-4 small">
              Try adjusting your rating filter or search term to discover community feedback.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <Button
                variant="outline-secondary"
                className="rounded-pill px-4"
                onClick={() => {
                  setFilterRating('all');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
              <Button
                variant="primary"
                className="rounded-pill px-4"
                onClick={() => setShowWriteModal(true)}
              >
                Write the First Review!
              </Button>
            </div>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredReviews.map((review) => (
              <Col key={review.id}>
                <Card className="h-100 border-0 shadow-sm rounded-4 testimonial-card transition-all position-relative overflow-hidden">
                  <Card.Body className="p-4 d-flex flex-column">
                    {/* Top Row: Stars, Product Badge & Optional Community/Delete button */}
                    <div className="d-flex justify-content-between align-items-start mb-3 gap-2">
                      <div className="d-flex text-warning gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            fill={i < review.rating ? '#f59e0b' : 'transparent'}
                            color="#f59e0b"
                            size={16}
                          />
                        ))}
                      </div>

                      <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
                        <span className="badge bg-light text-secondary border fw-normal small px-2 py-1 text-truncate" style={{ maxWidth: '140px' }}>
                          {review.product}
                        </span>

                        {review.isUserSubmitted && (
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-semibold small px-2 py-1">
                            Your Review
                          </span>
                        )}

                        {review.isUserSubmitted && (
                          <button
                            type="button"
                            className="btn btn-link text-danger p-0 border-0 d-flex align-items-center"
                            onClick={() => handleDeleteReview(review.id)}
                            title="Delete this review"
                            aria-label={`Delete review by ${review.name}`}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Review Quote Text */}
                    <div className="mb-4 position-relative flex-grow-1">
                      <RiDoubleQuotesL
                        className="position-absolute text-light"
                        style={{
                          top: '-10px',
                          left: '-10px',
                          fontSize: '3rem',
                          zIndex: 0,
                          opacity: 0.5
                        }}
                      />
                      <p
                        className="text-secondary position-relative"
                        style={{ zIndex: 1, lineHeight: '1.6', fontSize: '0.95rem' }}
                      >
                        &ldquo;{review.text}&rdquo;
                      </p>
                    </div>

                    {/* Author Footer */}
                    <div className="d-flex align-items-center gap-3 pt-3 border-top border-light">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0"
                        style={{
                          width: '45px',
                          height: '45px',
                          backgroundColor: review.color,
                          fontSize: '1.1rem'
                        }}
                      >
                        {review.avatar}
                      </div>
                      <div className="min-w-0">
                        <h6 className="mb-0 fw-bold text-dark d-flex align-items-center gap-1 text-truncate">
                          <span>{review.name}</span>
                          <FiCheckCircle className="text-primary flex-shrink-0" size={14} title="Verified Buyer" />
                        </h6>
                        <small className="text-muted d-block text-truncate">
                          {review.role} • {review.date}
                        </small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>

      {/* ============================================================== */}
      {/* 4. WRITE REVIEW MODAL                                          */}
      {/* ============================================================== */}
      <WriteReviewModal
        show={showWriteModal}
        onHide={() => setShowWriteModal(false)}
        onSubmitReview={handleAddReview}
      />
    </div>
  );
}

import { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiStar, FiCheck } from 'react-icons/fi';
import storeItems from '../data/items.json';

const AVATAR_COLORS = [
  '#4f46e5',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#3b82f6',
  '#ea580c',
];

const reviewSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  role: z
    .string()
    .trim()
    .min(1, 'Role or headline is required')
    .min(2, 'Role must be at least 2 characters')
    .max(40, 'Role cannot exceed 40 characters'),
  product: z
    .string()
    .trim()
    .min(1, 'Please select a product or topic'),
  rating: z
    .number()
    .min(1, 'Please select at least 1 star')
    .max(5, 'Maximum rating is 5 stars'),
  text: z
    .string()
    .trim()
    .min(1, 'Review text is required')
    .min(10, 'Review must be at least 10 characters')
    .max(500, 'Review cannot exceed 500 characters'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export type NewReviewPayload = {
  name: string;
  role: string;
  product: string;
  rating: number;
  text: string;
  avatar: string;
  color: string;
};

type WriteReviewModalProps = {
  show: boolean;
  onHide: () => void;
  onSubmitReview: (review: NewReviewPayload) => void;
};

const RATING_LABELS: Record<number, string> = {
  1: 'Poor (1/5)',
  2: 'Fair (2/5)',
  3: 'Good (3/5)',
  4: 'Very Good (4/5)',
  5: 'Outstanding! (5/5)',
};

export function WriteReviewModal({ show, onHide, onSubmitReview }: WriteReviewModalProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>(AVATAR_COLORS[0]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      role: 'Verified Buyer',
      product: storeItems[0]?.name ? `${storeItems[0].name.toUpperCase()}` : 'General Store Experience',
      rating: 5,
      text: ''
    }
  });

  const currentRating = watch('rating') || 0;
  const watchedName = watch('name') || '';
  const watchedText = watch('text') || '';

  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'SC';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleFormSubmit = (data: ReviewFormData) => {
    const avatar = getInitials(data.name);
    onSubmitReview({
      name: data.name,
      role: data.role,
      product: data.product,
      rating: data.rating,
      text: data.text,
      avatar,
      color: selectedColor,
    });
    reset();
    onHide();
  };

  const handleModalClose = () => {
    reset();
    setHoverRating(0);
    onHide();
  };

  // Unique list of product names for selection dropdown
  const productOptions = [
    ...storeItems.map((item) => item.name.toUpperCase()),
    'GENERAL SHOPPING & DELIVERY EXPERIENCE',
  ];

  const activeStarIndex = hoverRating || currentRating;

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      centered
      size="lg"
      className="write-review-modal"
      backdropClassName="product-quickview-backdrop"
      aria-labelledby="write-review-title"
    >
      <Modal.Header className="border-bottom py-3 px-4 position-relative">
        <div>
          <Modal.Title id="write-review-title" className="fw-bold fs-4 text-dark mb-1">
            Write a Review
          </Modal.Title>
          <p className="text-muted small mb-0">
            Share your shopping experience with thousands of fellow community members.
          </p>
        </div>
        <button
          type="button"
          className="btn-close ms-auto"
          onClick={handleModalClose}
          aria-label="Close review modal"
        />
      </Modal.Header>

      <Modal.Body className="p-4">
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-3 mb-4 rounded-3 bg-light border d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm transition-all"
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: selectedColor,
                  fontSize: '1.15rem'
                }}
              >
                {getInitials(watchedName)}
              </div>
              <div>
                <div className="fw-bold text-dark mb-0">
                  {watchedName.trim() || 'Your Name Preview'}
                </div>
                <div className="text-muted small">
                  {watch('role') || 'Verified Buyer'}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-1">
              <span className="small text-muted me-1 d-none d-sm-inline">Avatar:</span>
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch-btn ${selectedColor === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setSelectedColor(c)}
                  title={`Select avatar color ${c}`}
                  aria-label={`Select avatar color ${c}`}
                >
                  {selectedColor === c && <FiCheck size={12} color="#ffffff" />}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 text-center p-3 rounded-3 border bg-white shadow-sm">
            <Form.Label className="fw-bold text-dark d-block mb-2">
              Overall Rating <span className="text-danger">*</span>
            </Form.Label>
            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="star-picker-btn p-1 border-0 bg-transparent"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setValue('rating', star, { shouldValidate: true })}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <FiStar
                    size={32}
                    fill={star <= activeStarIndex ? '#f59e0b' : 'transparent'}
                    color={star <= activeStarIndex ? '#f59e0b' : 'var(--star-empty, #cbd5e1)'}
                    style={{ transition: 'all 0.15s ease' }}
                  />
                </button>
              ))}
            </div>
            <div className="small fw-semibold text-warning">
              {activeStarIndex > 0 ? RATING_LABELS[activeStarIndex] : 'Click to rate your experience'}
            </div>
            {errors.rating && (
              <div className="text-danger small mt-1">{errors.rating.message}</div>
            )}
          </div>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Group controlId="review-name">
                <Form.Label className="small fw-bold text-dark">
                  Your Full Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  {...register('name')}
                  isInvalid={!!errors.name}
                  className="rounded-3"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="review-role">
                <Form.Label className="small fw-bold text-dark">
                  Role / Tagline <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Verified Buyer, Sneakerhead, Designer"
                  {...register('role')}
                  isInvalid={!!errors.role}
                  className="rounded-3"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.role?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="mb-3">
            <Form.Group controlId="review-product">
              <Form.Label className="small fw-bold text-dark">
                Product or Experience Reviewed <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                {...register('product')}
                isInvalid={!!errors.product}
                className="rounded-3"
              >
                {productOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.product?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="mb-4">
            <Form.Group controlId="review-text">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <Form.Label className="small fw-bold text-dark mb-0">
                  Your Review <span className="text-danger">*</span>
                </Form.Label>
                <span className={`small ${watchedText.length > 500 ? 'text-danger' : 'text-muted'}`}>
                  {watchedText.length}/500 characters
                </span>
              </div>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="What did you love about the product? How was the delivery speed, packaging, and quality? Be as honest and descriptive as possible..."
                {...register('text')}
                isInvalid={!!errors.text}
                className="rounded-3"
              />
              <Form.Control.Feedback type="invalid">
                {errors.text?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="d-flex align-items-center justify-content-end gap-2 pt-3 border-top">
            <Button
              variant="outline-secondary"
              className="rounded-pill px-4"
              onClick={handleModalClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="rounded-pill px-4 fw-semibold shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Publish Review'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

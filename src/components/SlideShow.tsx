import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FiChevronLeft, FiChevronRight, FiShoppingBag, FiStar } from 'react-icons/fi';
import { formatCurrency } from '../utilities/formatCurrency';
import { useShoppingCart } from '../context/ShoppingCartContext';

export type ShowcaseSlide = {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  tag: string;
  imageUrl: string;
};

type SlideshowProps = {
  slides: ShowcaseSlide[];
  interval?: number;
};

const Slideshow: React.FC<SlideshowProps> = ({ slides, interval = 4500 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { increaseItemQuantity, getItemQuantity } = useShoppingCart();

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, isPaused, slides.length]);

  if (!slides || slides.length === 0) return null;

  const current = slides[currentSlide];
  const qty = getItemQuantity(current.id);

  return (
    <div
      className="showcase-carousel-card w-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <span className="showcase-badge">{current.tag || current.category}</span>
      <span className="showcase-price-tag">{formatCurrency(current.price)}</span>

      <div className="showcase-img-container">
        <img
          key={current.id}
          src={current.imageUrl}
          alt={current.name}
          className="showcase-img"
        />
      </div>

      <div className="w-100 text-center mt-3">
        <h3 className="text-white fw-bold mb-1 fs-4 text-capitalize">
          {current.name}
        </h3>
        <div className="d-flex align-items-center justify-content-center gap-1 mb-3 text-warning">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              size={15}
              fill={i < current.rating ? '#f59e0b' : 'transparent'}
              color="#f59e0b"
            />
          ))}
          <span className="text-white-50 ms-1 small">({current.rating}.0)</span>
        </div>

        <div className="d-flex align-items-center justify-content-center gap-2">
          <Button
            size="sm"
            onClick={() => increaseItemQuantity(current.id)}
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.45rem 1.25rem',
              fontWeight: 600
            }}
            className="d-flex align-items-center gap-2"
          >
            <FiShoppingBag size={15} />
            {qty > 0 ? `In Cart (${qty}) +` : 'Quick Add'}
          </Button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="d-flex align-items-center justify-content-between w-100 mt-3 pt-2">
        <button
          className="showcase-nav-btn"
          onClick={goToPrevSlide}
          title="Previous slide"
        >
          <FiChevronLeft size={20} />
        </button>

        <div className="carousel-dots">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`carousel-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>

        <button
          className="showcase-nav-btn"
          onClick={goToNextSlide}
          title="Next slide"
        >
          <FiChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Slideshow;

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiArrowUp } from 'react-icons/fi';

type ScrollToTopProps = {
  showOffset?: number;
  routes?: string[];
};

export function ScrollToTop({
  showOffset = 300,
  routes
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  const isEligiblePage = routes ? routes.includes(location.pathname) : true;

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!isEligiblePage) {
      setIsVisible(false);
      return;
    }

    const checkScrollPosition = () => {
      if (window.scrollY > showOffset) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    checkScrollPosition();
    window.addEventListener('scroll', checkScrollPosition, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, [isEligiblePage, showOffset]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isEligiblePage) return null;

  return (
    <button
      type="button"
      className={`scroll-to-top-btn ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      title="Scroll to top"
      aria-label="Scroll to top"
    >
      <FiArrowUp size={20} />
    </button>
  );
}


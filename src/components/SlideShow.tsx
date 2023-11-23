import React, { useState, useEffect } from 'react';

type Slide = {
  id: number;
  imageUrl: string;
};

type SlideshowProps = {
  slides: Slide[];
  interval?: number; // Optional interval prop in milliseconds
};

const Slideshow: React.FC<SlideshowProps> = ({ slides, interval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const autoSlideInterval = setInterval(goToNextSlide, interval);

    return () => {
      clearInterval(autoSlideInterval);
    };
  }, [interval]);

  const slideshowContainerStyle: React.CSSProperties = {
    position: 'relative',
    maxWidth: '100%', // Adjust the maximum width as needed
    margin: 'auto',
    overflow: 'hidden',
  };

  const slideStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '400px', // Adjust the maximum height as needed
  };

  const imgStyle: React.CSSProperties = {
    objectFit: 'cover',
    maxWidth: '100%',
    maxHeight: '100%', // Adjust the maximum height as needed
    width: '100%', // Set a fixed width to ensure all images have the same size
    height: 'auto',
  };

  const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    fontSize: '20px',
    padding: '10px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  };

  const prevButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    left: '0',
  };

  const nextButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    right: '0',
  };

  return (
    <div style={slideshowContainerStyle}>
      <button style={prevButtonStyle} onClick={goToPrevSlide}>&#10094;</button>
      <div style={slideStyle}>
        <img src={slides[currentSlide].imageUrl} alt={`Slide ${slides[currentSlide].id}`} style={imgStyle} />
      </div>
      <button style={nextButtonStyle} onClick={goToNextSlide}>&#10095;</button>
    </div>
  );
};

export default Slideshow;

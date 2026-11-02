import React, { useState, useEffect, useRef } from 'react';
import { RiImageLine } from 'react-icons/ri';

export type LazyImageProps = {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  style?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  aspectRatio?: string;
  fallbackIcon?: React.ReactNode;
  showSkeleton?: boolean;
  blurUp?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  width?: number | string;
  height?: number | string;
};

export function LazyImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  style,
  wrapperStyle,
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
  aspectRatio,
  fallbackIcon,
  showSkeleton = true,
  blurUp = true,
  objectFit = 'contain',
  width,
  height,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setHasError(false);
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [src]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    setIsLoaded(false);
    onError?.(e);
  };

  return (
    <div
      className={`lazy-image-container ${wrapperClassName}`}
      style={{
        aspectRatio,
        width,
        height,
        ...wrapperStyle,
      }}
    >
      {showSkeleton && !hasError && (
        <div
          className={`lazy-image-skeleton ${isLoaded ? 'hidden' : ''}`}
          aria-hidden="true"
        >
          <div className="lazy-image-shimmer-highlight" />
        </div>
      )}

      {hasError ? (
        <div className="lazy-image-fallback" role="img" aria-label={alt || 'Image unavailable'}>
          {fallbackIcon || <RiImageLine size={24} className="lazy-image-fallback-icon" />}
          <span className="lazy-image-fallback-text">{alt || 'Product image'}</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={handleLoad}
          onError={handleError}
          className={`lazy-image-img ${blurUp ? (isLoaded ? 'loaded' : 'loading') : ''} ${className}`}
          style={{
            objectFit,
            ...style,
          }}
        />
      )}
    </div>
  );
}


import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Col, Row, Form, Button, Offcanvas, Pagination } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { StoreItem } from '../components/StoreItem';
import storeItems from '../data/items.json';
import {
  FiFilter,
  FiRotateCcw,
  FiSearch,
  FiSliders,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiStar
} from 'react-icons/fi';
import { RiShoppingBag3Fill } from 'react-icons/ri';

type Item = {
  id: number;
  name: string;
  category: string;
  rating: number;
  price: number;
  imgUrl: string;
};

const pricePresets = [
  { label: 'All', value: 1500 },
  { label: '< $100', value: 100 },
  { label: '< $500', value: 500 },
  { label: '< $1000', value: 1000 },
];

const ratingOptions = [
  { label: 'All', value: 0 },
  { label: '3★+', value: 3 },
  { label: '4★+', value: 4 },
  { label: '5★', value: 5 },
];

const categories = [
  { id: 'all', label: 'All Products', icon: '⚡' },
  { id: 'shoes', label: 'Shoes & Sneakers', icon: '👟' },
  { id: 'books', label: 'Books & Literature', icon: '📚' },
  { id: 'laptop', label: 'Laptops', icon: '💻' },
  { id: 'phone', label: 'Smartphones', icon: '📱' }
];

export function Store() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial values from URL params
  const urlCategory = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('search') || '';
  const urlMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 1500;
  const urlMinRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : 0;
  const urlSort = searchParams.get('sort') || 'featured';
  const urlPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [minRating, setMinRating] = useState<number>(urlMinRating);
  const [maxPrice, setMaxPrice] = useState<number>(urlMaxPrice);
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(urlSearch);
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(urlPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
  const [sortBy, setSortBy] = useState<string>(urlSort);

  const productGridRef = useRef<HTMLDivElement>(null);

  // Sync state when URL params change externally (e.g. back/forward navigation or clicking links)
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const s = searchParams.get('search') || '';
    const p = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 1500;
    const r = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : 0;
    const sort = searchParams.get('sort') || 'featured';
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

    setSelectedCategory(cat);
    setSearchQuery(s);
    setDebouncedSearchQuery(s);
    setMaxPrice(p);
    setMinRating(r);
    setSortBy(sort);
    setCurrentPage(page);
  }, [searchParams]);

  // Helper to update URL search parameters
  const updateUrlParams = useCallback((updates: Record<string, string | number | undefined>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, val]) => {
        if (
          val === undefined ||
          val === '' ||
          val === 'all' ||
          (key === 'maxPrice' && val === 1500) ||
          (key === 'minRating' && val === 0) ||
          (key === 'sort' && val === 'featured') ||
          (key === 'page' && val === 1)
        ) {
          next.delete(key);
        } else {
          next.set(key, String(val));
        }
      });
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  // Debounce search typing
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      updateUrlParams({ search: searchQuery });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery, updateUrlParams]);

  // Dynamic counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: storeItems.length
    };
    storeItems.forEach((item) => {
      const cat = item.category.toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredItems = useMemo(() => (storeItems as Item[]).filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesRating = item.rating >= minRating;
    const matchesPrice = item.price <= maxPrice;
    const matchesSearch = item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

    return matchesCategory && matchesRating && matchesPrice && matchesSearch;
  }), [debouncedSearchQuery, maxPrice, minRating, selectedCategory]);

  const sortedItems = useMemo(() => {
    const items = [...filteredItems];
    if (sortBy === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      items.sort((a, b) => b.rating - a.rating);
    }
    return items;
  }, [filteredItems, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = useMemo(() => {
    return sortedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedItems, startIndex, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
    updateUrlParams({ page: 1 });
  }, [debouncedSearchQuery, selectedCategory, minRating, maxPrice, sortBy, itemsPerPage, updateUrlParams]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    updateUrlParams({ page });
    if (productGridRef.current) {
      productGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    updateUrlParams({ category: catId, page: 1 });
  };

  const handlePriceChange = (price: number) => {
    setMaxPrice(price);
    updateUrlParams({ maxPrice: price, page: 1 });
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(rating);
    updateUrlParams({ minRating: rating, page: 1 });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateUrlParams({ sort, page: 1 });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    updateUrlParams({ search: '', page: 1 });
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setMinRating(0);
    setMaxPrice(1500);
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (maxPrice < 1500 ? 1 : 0) +
    (debouncedSearchQuery.trim() !== '' ? 1 : 0);

  const getPageNumbers = () => {
    const pages: number[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push(-1);
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push(-1);
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const renderFilterControls = () => (
    <>
      {/* Search Input */}
      <div className="mb-4">
        <Form.Label className="small fw-bold text-muted mb-2">Search Products</Form.Label>
        <div className="position-relative">
          <FiSearch className="position-absolute text-muted" style={{ top: '11px', left: '14px' }} />
          <Form.Control
            type="text"
            placeholder="e.g. MacBook, Jordan..."
            className="ps-5 pe-4 rounded-pill"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn btn-link position-absolute p-0 text-muted border-0 d-flex align-items-center justify-content-center"
              style={{ top: '8px', right: '12px', width: '22px', height: '22px', textDecoration: 'none' }}
              onClick={handleClearSearch}
              title="Clear search"
              aria-label="Clear search"
            >
              <FiX size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label className="small fw-bold text-muted mb-0">Categories</Form.Label>
          {selectedCategory !== 'all' && (
            <button
              type="button"
              className="btn btn-link p-0 text-muted small text-decoration-none"
              style={{ fontSize: '0.75rem' }}
              onClick={() => handleCategoryChange('all')}
            >
              Show All
            </button>
          )}
        </div>
        <div className="d-flex flex-column gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                type="button"
                className={`store-category-btn ${isSelected ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                <span className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: '1.05rem' }}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </span>
                <span className={`category-count-badge ${isSelected ? 'active' : ''}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label className="small fw-bold text-muted mb-0">Max Price</Form.Label>
          <span className="badge bg-primary rounded-pill font-monospace">${maxPrice}</span>
        </div>
        <Form.Range
          min={50}
          max={1500}
          step={50}
          value={maxPrice}
          onChange={(e) => handlePriceChange(parseInt(e.target.value, 10))}
          className="mb-2"
        />
        <div className="d-flex justify-content-between text-muted mb-2" style={{ fontSize: '0.75rem' }}>
          <span>$50</span>
          <span>$1500+</span>
        </div>
        <div className="d-flex flex-wrap gap-1">
          {pricePresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={`price-preset-pill ${maxPrice === preset.value ? 'active' : ''}`}
              onClick={() => handlePriceChange(preset.value)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="mb-3">
        <Form.Label className="small fw-bold text-muted mb-2">Minimum Rating</Form.Label>
        <div className="d-flex gap-1">
          {ratingOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`rating-filter-pill ${minRating === opt.value ? 'active' : ''}`}
              onClick={() => handleRatingChange(opt.value)}
            >
              {opt.value > 0 && (
                <FiStar
                  size={12}
                  fill={minRating === opt.value ? '#ffffff' : '#f59e0b'}
                  color={minRating === opt.value ? '#ffffff' : '#f59e0b'}
                />
              )}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="store-page-container">
      <section className="about-hero-section mb-4">
        <div className="hero-tag mx-auto">
          <RiShoppingBag3Fill color="#38bdf8" />
          <span>Curated Catalog</span>
        </div>
        <h1 className="hero-title mb-3">
          Explore Our <span className="hero-gradient-text">Exclusive Collection</span>
        </h1>
        <p className="hero-subtitle mx-auto">
          Discover premium tech, iconic footwear, and inspiring literature handpicked for you.
        </p>
      </section>

      <Row className="g-4 mb-5">
        <Col lg={3} className="d-none d-lg-block">
          <div className="store-filter-sidebar p-4 bg-white rounded-4 border shadow-sm sticky-top" style={{ top: '90px' }}>
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <FiSliders className="text-primary" /> Filters
                {activeFilterCount > 0 && (
                  <span className="badge bg-primary text-white rounded-pill ms-1" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                    {activeFilterCount}
                  </span>
                )}
              </h5>
              {activeFilterCount > 0 && (
                <Button
                  variant="link"
                  className="text-muted p-0 text-decoration-none small d-flex align-items-center gap-1"
                  onClick={clearFilters}
                >
                  <FiRotateCcw size={13} /> Reset
                </Button>
              )}
            </div>

            {renderFilterControls()}
          </div>
        </Col>

        {/* 3. PRODUCT GRID */}
        <Col xs={12} lg={9} ref={productGridRef}>
          <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-4 border shadow-sm flex-wrap gap-3">
            <div>
              <h5 className="mb-0 fw-bold text-dark">
                {categories.find(c => c.id.toLowerCase() === selectedCategory.toLowerCase())?.label || 'Products'}
              </h5>
              <span className="text-muted small fw-semibold">
                Showing {sortedItems.length === 0 ? '0' : `${startIndex + 1}–${Math.min(startIndex + itemsPerPage, sortedItems.length)}`} of {sortedItems.length} product{sortedItems.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="d-lg-none">
                <Button
                  variant="outline-primary"
                  className="d-flex align-items-center gap-1 rounded-pill px-3 py-1 fw-semibold btn-sm"
                  onClick={() => setShowMobileFilter(true)}
                >
                  <FiSliders size={14} />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="badge bg-primary text-white rounded-pill ms-1">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </div>

              <div className="d-flex align-items-center gap-1">
                <Form.Select
                  size="sm"
                  className="rounded-pill px-3 py-1"
                  style={{ width: 'auto', minWidth: '150px' }}
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                </Form.Select>
              </div>

              <div className="d-flex align-items-center gap-1">
                <Form.Select
                  size="sm"
                  className="rounded-pill px-3 py-1"
                  style={{ width: 'auto' }}
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  aria-label="Items per page"
                >
                  <option value={6}>6 / page</option>
                  <option value={9}>9 / page</option>
                  <option value={12}>12 / page</option>
                </Form.Select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {activeFilterCount > 0 && (
            <div className="d-flex align-items-center flex-wrap gap-2 mb-4 p-2 px-3 bg-white rounded-3 border shadow-sm">
              <span className="text-muted small fw-semibold me-1 d-flex align-items-center gap-1">
                <FiFilter size={13} /> Active:
              </span>
              {selectedCategory !== 'all' && (
                <span className="active-filter-chip">
                  <span>Category: {categories.find(c => c.id.toLowerCase() === selectedCategory.toLowerCase())?.label || selectedCategory}</span>
                  <button type="button" onClick={() => handleCategoryChange('all')} aria-label="Clear category filter">
                    <FiX size={14} />
                  </button>
                </span>
              )}
              {debouncedSearchQuery.trim() !== '' && (
                <span className="active-filter-chip">
                  <span>Search: &ldquo;{debouncedSearchQuery}&rdquo;</span>
                  <button type="button" onClick={handleClearSearch} aria-label="Clear search filter">
                    <FiX size={14} />
                  </button>
                </span>
              )}
              {maxPrice < 1500 && (
                <span className="active-filter-chip">
                  <span>Max: ${maxPrice}</span>
                  <button type="button" onClick={() => handlePriceChange(1500)} aria-label="Clear price filter">
                    <FiX size={14} />
                  </button>
                </span>
              )}
              {minRating > 0 && (
                <span className="active-filter-chip">
                  <span>Rating: {minRating}★+</span>
                  <button type="button" onClick={() => handleRatingChange(0)} aria-label="Clear rating filter">
                    <FiX size={14} />
                  </button>
                </span>
              )}
              <button
                type="button"
                className="btn btn-link text-danger p-0 ms-auto small text-decoration-none fw-semibold"
                style={{ fontSize: '0.8rem' }}
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>
          )}

          {sortedItems.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
              <div className="mb-3" style={{ fontSize: '3rem', color: '#cbd5e1' }}>
                <FiFilter />
              </div>
              <h4 className="fw-bold text-dark mb-2">No matching products</h4>
              <p className="text-muted mb-4">
                We couldn't find any products matching your current filters.
              </p>
              <Button variant="primary" className="rounded-pill px-4" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <Row xs={1} sm={2} lg={3} className="g-4">
                {paginatedItems.map((item) => (
                  <Col key={item.id}>
                    <StoreItem
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      rating={item.rating}
                      imgUrl={item.imgUrl}
                      category={item.category}
                    />
                  </Col>
                ))}
              </Row>

              {totalPages > 1 && (
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-5 pt-3 border-top gap-3 store-pagination-container">
                  <div className="text-muted small">
                    Page <span className="fw-bold text-dark">{currentPage}</span> of <span className="fw-bold text-dark">{totalPages}</span>
                  </div>
                  <Pagination className="mb-0 custom-store-pagination">
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      <FiChevronLeft size={16} className="me-1" />
                      <span className="d-none d-sm-inline">Prev</span>
                    </Pagination.Prev>

                    {getPageNumbers().map((pageNum, idx) =>
                      pageNum === -1 ? (
                        <Pagination.Ellipsis key={`ellipsis-${idx}`} disabled />
                      ) : (
                        <Pagination.Item
                          key={pageNum}
                          active={pageNum === currentPage}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Pagination.Item>
                      )
                    )}

                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                    >
                      <span className="d-none d-sm-inline">Next</span>
                      <FiChevronRight size={16} className="ms-1" />
                    </Pagination.Next>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>

      <Offcanvas
        show={showMobileFilter}
        onHide={() => setShowMobileFilter(false)}
        placement="start"
        className="store-filter-offcanvas"
      >
        <Offcanvas.Header closeButton className="border-bottom py-3">
          <Offcanvas.Title className="d-flex align-items-center gap-2 fw-bold fs-5">
            <FiSliders className="text-primary" size={20} />
            <span>Filter Products</span>
            {activeFilterCount > 0 && (
              <span className="badge bg-primary rounded-pill small px-2 py-1">
                {activeFilterCount} active
              </span>
            )}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-4 d-flex flex-column">
          <div className="flex-grow-1 overflow-auto pe-1">
            {renderFilterControls()}
          </div>
          <div className="pt-3 border-top d-flex gap-2 mt-3">
            <Button
              variant="outline-secondary"
              className="rounded-pill flex-grow-1 py-2 fw-semibold d-flex align-items-center justify-content-center gap-1"
              onClick={clearFilters}
            >
              <FiRotateCcw size={14} /> Reset
            </Button>
            <Button
              variant="primary"
              className="rounded-pill flex-grow-1 py-2 fw-semibold shadow"
              onClick={() => setShowMobileFilter(false)}
            >
              Show {sortedItems.length} Results
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}


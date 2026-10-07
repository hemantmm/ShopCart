import { useEffect, useMemo, useRef, useState } from 'react';
import { Col, Row, Form, Button, Offcanvas, Pagination } from 'react-bootstrap';
import { StoreItem } from '../components/StoreItem';
import storeItems from '../data/items.json';
import { FiFilter, FiRotateCcw, FiSearch, FiSliders, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { RiShoppingBag3Fill } from 'react-icons/ri';

type Item = {
  id: number;
  name: string;
  category: string;
  rating: number;
  price: number;
  imgUrl: string;
};

export function Store() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
  const [sortBy, setSortBy] = useState<string>('featured');

  const productGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

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
  }, [debouncedSearchQuery, selectedCategory, minRating, maxPrice, sortBy, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    if (productGridRef.current) {
      productGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

  const clearFilters = () => {
    setSelectedCategory('all');
    setMinRating(0);
    setMaxPrice(1500);
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
  };

  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (maxPrice < 1500 ? 1 : 0) +
    (debouncedSearchQuery.trim() !== '' ? 1 : 0);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'shoes', label: 'Shoes & Sneakers' },
    { id: 'books', label: 'Books & Literature' },
    { id: 'laptop', label: 'Laptops' },
    { id: 'phone', label: 'Smartphones' }
  ];

  const renderFilterControls = () => (
    <>
      <div className="mb-4">
        <Form.Label className="small fw-bold text-muted mb-2">Search Products</Form.Label>
        <div className="position-relative">
          <FiSearch className="position-absolute text-muted" style={{ top: '10px', left: '12px' }} />
          <Form.Control
            type="text"
            placeholder="e.g. MacBook..."
            className="ps-5 rounded-pill"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <Form.Label className="small fw-bold text-muted mb-2">Categories</Form.Label>
        <div className="d-flex flex-column gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`btn text-start px-3 py-2 rounded-3 border-0 transition-all ${
                selectedCategory === cat.id 
                  ? 'btn-primary fw-semibold' 
                  : 'btn-light text-muted hover-bg-gray'
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label className="small fw-bold text-muted mb-0">Max Price</Form.Label>
          <span className="badge bg-primary rounded-pill">${maxPrice}</span>
        </div>
        <Form.Range
          min={0}
          max={1500}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
        />
        <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
          <span>$0</span>
          <span>$1500+</span>
        </div>
      </div>

      <div className="mb-3">
        <Form.Label className="small fw-bold text-muted mb-2">Minimum Rating</Form.Label>
        <Form.Select
          className="rounded-pill"
          value={minRating}
          onChange={(e) => setMinRating(parseFloat(e.target.value))}
        >
          <option value="0">All Ratings</option>
          <option value="3">3★ & above</option>
          <option value="4">4★ & above</option>
          <option value="5">5★ only</option>
        </Form.Select>
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
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <FiSliders className="text-primary" /> Filters
              </h5>
              <Button
                variant="link"
                className="text-muted p-0 text-decoration-none small d-flex align-items-center gap-1"
                onClick={clearFilters}
              >
                <FiRotateCcw size={14} /> Reset
              </Button>
            </div>

            {renderFilterControls()}
          </div>
        </Col>

        {/* 3. PRODUCT GRID */}
        <Col xs={12} lg={9} ref={productGridRef}>
          <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-4 border shadow-sm flex-wrap gap-3">
            <div>
              <h5 className="mb-0 fw-bold text-dark">
                {categories.find(c => c.id === selectedCategory)?.label || 'Products'}
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
                  onChange={(e) => setSortBy(e.target.value)}
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


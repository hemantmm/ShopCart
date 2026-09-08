import { useState } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import { StoreItem } from '../components/StoreItem';
import storeItems from '../data/items.json';
import { FiFilter, FiRotateCcw, FiSearch, FiSliders } from 'react-icons/fi';
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
  const [filteredItems, setFilteredItems] = useState<Item[]>(storeItems as Item[]);

  const applyFilters = (category: string, rating: number, priceMax: number, search: string) => {
    const filtered = (storeItems as Item[]).filter((item) => {
      const matchesCategory = category === 'all' || item.category.toLowerCase() === category.toLowerCase();
      const matchesRating = item.rating >= rating;
      const matchesPrice = item.price <= priceMax;
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      
      return matchesCategory && matchesRating && matchesPrice && matchesSearch;
    });
    setFilteredItems(filtered);
    setSelectedCategory(category);
    setMinRating(rating);
    setMaxPrice(priceMax);
    setSearchQuery(search);
  };

  const clearFilters = () => {
    setFilteredItems(storeItems as Item[]);
    setSelectedCategory('all');
    setMinRating(0);
    setMaxPrice(1500);
    setSearchQuery('');
  };

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'shoes', label: 'Shoes & Sneakers' },
    { id: 'books', label: 'Books & Literature' },
    { id: 'laptop', label: 'Laptops' },
    { id: 'phone', label: 'Smartphones' }
  ];

  return (
    <div className="store-page-container">
      {/* 1. STORE HERO BANNER */}
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
        {/* 2. SIDEBAR FILTERS (DESKTOP) */}
        <Col lg={3}>
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

            {/* Search */}
            <div className="mb-4">
              <Form.Label className="small fw-bold text-muted mb-2">Search Products</Form.Label>
              <div className="position-relative">
                <FiSearch className="position-absolute text-muted" style={{ top: '10px', left: '12px' }} />
                <Form.Control
                  type="text"
                  placeholder="e.g. MacBook..."
                  className="ps-5 rounded-pill"
                  value={searchQuery}
                  onChange={(e) => applyFilters(selectedCategory, minRating, maxPrice, e.target.value)}
                />
              </div>
            </div>

            {/* Categories */}
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
                    onClick={() => applyFilters(cat.id, minRating, maxPrice, searchQuery)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price */}
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
                onChange={(e) => applyFilters(selectedCategory, minRating, parseInt(e.target.value), searchQuery)}
              />
              <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
                <span>$0</span>
                <span>$1500+</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="mb-3">
              <Form.Label className="small fw-bold text-muted mb-2">Minimum Rating</Form.Label>
              <Form.Select
                className="rounded-pill"
                value={minRating}
                onChange={(e) => applyFilters(selectedCategory, parseFloat(e.target.value), maxPrice, searchQuery)}
              >
                <option value="0">All Ratings</option>
                <option value="3">3★ & above</option>
                <option value="4">4★ & above</option>
                <option value="5">5★ only</option>
              </Form.Select>
            </div>
          </div>
        </Col>

        {/* 3. PRODUCT GRID */}
        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-4 border shadow-sm">
            <h5 className="mb-0 fw-bold text-dark">
              {categories.find(c => c.id === selectedCategory)?.label || 'Products'}
            </h5>
            <span className="text-muted small fw-semibold">
              Showing {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredItems.length === 0 ? (
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
            <Row xs={1} sm={2} lg={3} className="g-4">
              {filteredItems.map((item) => (
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
          )}
        </Col>
      </Row>
    </div>
  );
}

import { useState } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import { StoreItem } from '../components/StoreItem';
import storeItems from '../data/items.json';
import { FiFilter, FiRotateCcw } from 'react-icons/fi';

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
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(Infinity);
  const [filteredItems, setFilteredItems] = useState<Item[]>(storeItems as Item[]);

  const filterItemsByCategoryAndRating = (
    category: string,
    rating: number,
    minP: number,
    maxP: number
  ) => {
    const filtered = (storeItems as Item[]).filter((item) => {
      return (
        (category === 'all' || item.category.toLowerCase() === category.toLowerCase()) &&
        item.rating >= rating &&
        item.price >= minP &&
        item.price <= maxP
      );
    });
    setFilteredItems(filtered);
    setSelectedCategory(category);
    setMinRating(rating);
    setMinPrice(minP);
    setMaxPrice(maxP);
  };

  const clearFilters = () => {
    setFilteredItems(storeItems as Item[]);
    setSelectedCategory('all');
    setMinRating(0);
    setMinPrice(0);
    setMaxPrice(Infinity);
  };

  return (
    <div className="store-page-container">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="fw-bold mb-1">Catalog Store</h1>
          <p className="text-muted mb-0">Showing {filteredItems.length} curated products</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className="p-3 mb-4 rounded-3 border bg-white shadow-sm"
      >
        <div className="d-flex align-items-center gap-2 mb-3 text-primary fw-bold">
          <FiFilter />
          <span>Filters & Refinements</span>
        </div>

        <Row className="g-3 align-items-end">
          <Col md={3} sm={6}>
            <Form.Label className="small fw-bold text-muted mb-1">Category</Form.Label>
            <Form.Select
              value={selectedCategory}
              onChange={(e) =>
                filterItemsByCategoryAndRating(
                  e.target.value,
                  minRating,
                  minPrice,
                  maxPrice
                )
              }
            >
              <option value="all">All Categories</option>
              <option value="shoes">Shoes & Sneakers</option>
              <option value="books">Books & Literature</option>
              <option value="laptop">Laptops & Computers</option>
              <option value="phone">Smartphones</option>
            </Form.Select>
          </Col>

          <Col md={3} sm={6}>
            <Form.Label className="small fw-bold text-muted mb-1">Min Price ($)</Form.Label>
            <Form.Control
              type="number"
              min="0"
              placeholder="0"
              value={minPrice === 0 ? '' : minPrice}
              onChange={(e) =>
                filterItemsByCategoryAndRating(
                  selectedCategory,
                  minRating,
                  e.target.value ? parseInt(e.target.value) : 0,
                  maxPrice
                )
              }
            />
          </Col>

          <Col md={3} sm={6}>
            <Form.Label className="small fw-bold text-muted mb-1">Min Rating (Stars)</Form.Label>
            <Form.Select
              value={minRating}
              onChange={(e) =>
                filterItemsByCategoryAndRating(
                  selectedCategory,
                  parseFloat(e.target.value),
                  minPrice,
                  maxPrice
                )
              }
            >
              <option value="0">All Ratings</option>
              <option value="3">3★ & above</option>
              <option value="4">4★ & above</option>
              <option value="5">5★ only</option>
            </Form.Select>
          </Col>

          <Col md={3} sm={6}>
            <Button
              variant="outline-secondary"
              className="w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={clearFilters}
            >
              <FiRotateCcw size={14} />
              Reset Filters
            </Button>
          </Col>
        </Row>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 border">
          <h4>No products found matching your filter criteria</h4>
          <p className="text-muted">Try resetting your filters to explore all available products.</p>
          <Button variant="primary" onClick={clearFilters}>Reset Filters</Button>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
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
    </div>
  );
}

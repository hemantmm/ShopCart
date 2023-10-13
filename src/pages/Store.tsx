import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { StoreItem } from '../components/StoreItem';
import storeItems from '../data/items.json';

type Item = {
  id: number;
  name: string;
  category: string;
  rating: number;
  price: number;
};

export function Store() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(Infinity);
  const [filteredItems, setFilteredItems] = useState<Item[]>(storeItems);

  const filterItemsByCategoryAndRating = (
    category: string,
    rating: number,
    minPrice: number,
    maxPrice: number
  ) => {
    const filtered = storeItems.filter((item) => {
      return (
        (category === 'all' || item.category === category) &&
        item.rating >= rating &&
        item.price >= minPrice &&
        item.price <= maxPrice
      );
    });
    setFilteredItems(filtered);
    setSelectedCategory(category);
    setMinRating(rating);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
  };

  const clearFilters = () => {
    setFilteredItems(storeItems);
    setSelectedCategory('all');
    setMinRating(0);
    setMinPrice(0);
    setMaxPrice(Infinity);
  };

  return (
    <>
      <h1>Store</h1>

      <select
        value={selectedCategory}
        onChange={(event) =>
          filterItemsByCategoryAndRating(
            event.target.value,
            minRating,
            minPrice,
            maxPrice
          )
        }
      >
        <option value="all">All</option>
        <option value="shoes">Shoes</option>
        <option value="books">Books</option>
        <option value="laptop">Laptop</option>
        <option value="phone">Mobile</option>
      </select>

      <div style={{display:"flex",alignItems:"center", justifyContent:"start",marginBottom:"10px",fontSize:"16px"}}>
        <label>Minimum Price:</label>
        <input
          type="number"
          value={minPrice}
          onChange={(event) =>
            filterItemsByCategoryAndRating(
              selectedCategory,
              minRating,
              parseInt(event.target.value),
              maxPrice
            )
          }
        />
      </div>

      <div style={{display:"flex",alignItems:"center", justifyContent:"start",marginBottom:"10px",fontSize:"16px"}}>
        <label>Maximum Price:</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(event) =>
            filterItemsByCategoryAndRating(
              selectedCategory,
              minRating,
              minPrice,
              parseInt(event.target.value)
            )
          }
        />
      </div>

      <div style={{display:"flex",alignItems:"center", justifyContent:"start",marginBottom:"10px",fontSize:"16px"}}>
        <label>Minimum Rating:</label>
        <input
          type="number"
          step="0.1"
          value={minRating}
          onChange={(event) =>
            filterItemsByCategoryAndRating(
              selectedCategory,
              parseFloat(event.target.value),
              minPrice,
              maxPrice
            )
          }
        />
      </div>

      <button style={{display:"flex",alignItems:"center", justifyContent:"start",marginBottom:"10px",fontSize:"16px"}} onClick={clearFilters}>Clear All Filters</button>

      <Row md={2} xs={1} lg={3} className="g-3">
        {filteredItems.map((item) => (
          <Col key={item.id}>
            <StoreItem imgUrl={''} {...item} />
          </Col>
        ))}
      </Row>
    </>
  );
}

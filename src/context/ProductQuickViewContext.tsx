import { createContext, ReactNode, useContext, useState, useCallback } from 'react';
import storeItems from '../data/items.json';
import { Product } from '../types/product';

type ProductQuickViewContextType = {
  selectedProduct: Product | null;
  isOpen: boolean;
  openQuickView: (productOrId: Product | number) => void;
  closeQuickView: () => void;
};

type ProductQuickViewProviderProps = {
  children: ReactNode;
};

const ProductQuickViewContext = createContext<ProductQuickViewContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useQuickView() {
  const context = useContext(ProductQuickViewContext);
  if (context === null) {
    throw new Error('useQuickView must be used within a ProductQuickViewProvider');
  }
  return context;
}

export function ProductQuickViewProvider({ children }: ProductQuickViewProviderProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openQuickView = useCallback((productOrId: Product | number) => {
    if (typeof productOrId === 'number') {
      const found = (storeItems as unknown as Product[]).find((item) => item.id === productOrId);
      if (found) {
        setSelectedProduct(found);
        setIsOpen(true);
      }
    } else if (productOrId && typeof productOrId === 'object') {
      setSelectedProduct(productOrId);
      setIsOpen(true);
    }
  }, []);

  const closeQuickView = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ProductQuickViewContext.Provider
      value={{
        selectedProduct,
        isOpen,
        openQuickView,
        closeQuickView,
      }}
    >
      {children}
    </ProductQuickViewContext.Provider>
  );
}

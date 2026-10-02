import { createContext, ReactNode, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import storeItems from '../data/items.json';

type WishlistProviderProps = {
  children: ReactNode;
};

const validItemIds = new Set(storeItems.map(item => item.id));

function isWishlistItems(value: unknown): value is number[] {
  return Array.isArray(value) && value.every(item => (
    typeof item === 'number' &&
    Number.isInteger(item) &&
    validItemIds.has(item)
  ));
}

type WishlistContext = {
  toggleWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  wishlistItems: number[];
  wishlistQuantity: number;
};

const WishlistContext = createContext<WishlistContext | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === null) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [wishlistItems, setWishlistItems] = useLocalStorage<number[]>("wishlist", [], isWishlistItems);

  const wishlistQuantity = wishlistItems.length;

  function isInWishlist(id: number) {
    return wishlistItems.includes(id);
  }

  function toggleWishlist(id: number) {
    setWishlistItems(currItems => {
      if (currItems.includes(id)) {
        return currItems.filter(itemId => itemId !== id);
      } else {
        return [...currItems, id];
      }
    });
  }

  return (
    <WishlistContext.Provider value={{ toggleWishlist, isInWishlist, wishlistItems, wishlistQuantity }}>
      {children}
    </WishlistContext.Provider>
  );
}

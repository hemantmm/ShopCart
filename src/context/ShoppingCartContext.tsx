import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import storeItems from '../data/items.json';
import { Product } from '../types/product';
import { areVariantsEqual, getDefaultVariants } from '../utilities/variantHelpers';

type ShoppingCartProviderProps = {
  children: ReactNode;
};

export type CartItem = {
  id: number;
  quantity: number;
  selectedVariants?: Record<string, string>;
};

const validItemIds = new Set(storeItems.map((item) => item.id));

function isCartItems(value: unknown): value is CartItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'number' &&
        Number.isInteger(item.id) &&
        validItemIds.has(item.id) &&
        typeof item.quantity === 'number' &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        (item.selectedVariants === undefined ||
          (typeof item.selectedVariants === 'object' &&
            item.selectedVariants !== null &&
            Object.values(item.selectedVariants).every((v: unknown) => typeof v === 'string')))
    )
  );
}

function areCartItemsEqual(a: CartItem[], b: CartItem[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((itemA, idx) => {
    const itemB = b[idx];
    return (
      itemB &&
      itemA.id === itemB.id &&
      itemA.quantity === itemB.quantity &&
      areVariantsEqual(itemA.selectedVariants, itemB.selectedVariants)
    );
  });
}

type ShoppingCartContext = {
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  isCartOpen: boolean;
  getItemQuantity: (id: number, selectedVariants?: Record<string, string>) => number;
  increaseItemQuantity: (
    id: number,
    selectedVariants?: Record<string, string>,
    deltaQuantity?: number
  ) => void;
  decreaseItemQuantity: (id: number, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (id: number, selectedVariants?: Record<string, string>) => void;
  updateItemVariants: (
    id: number,
    oldVariants: Record<string, string> | undefined,
    newVariants: Record<string, string>
  ) => void;
  cartQuantity: number;
  cartItems: CartItem[];
};

const ShoppingCartContext = createContext<ShoppingCartContext | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (context === null) {
    throw new Error('useShoppingCart must be used within ShoppingCartProvider');
  }
  return context;
}

const CART_STORAGE_KEY = 'shopping-cart';

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    CART_STORAGE_KEY,
    [],
    isCartItems
  );

  const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) {
        if (e.newValue === null || e.newValue === '') {
          setCartItems((curr) => (curr.length === 0 ? curr : []));
          return;
        }
        try {
          const parsedValue: unknown = JSON.parse(e.newValue);
          if (isCartItems(parsedValue)) {
            setCartItems((curr) =>
              areCartItemsEqual(curr, parsedValue) ? curr : parsedValue
            );
          }
        } catch {
          // Ignore corrupted JSON from external storage event
        }
      } else if (e.key === null) {
        // Storage was cleared across all keys in another tab
        setCartItems((curr) => (curr.length === 0 ? curr : []));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setCartItems]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  function getItemQuantity(id: number, selectedVariants?: Record<string, string>) {
    if (selectedVariants !== undefined) {
      const match = cartItems.find(
        (item) => item.id === id && areVariantsEqual(item.selectedVariants, selectedVariants)
      );
      return match?.quantity || 0;
    }
    // If no variants specified, return total quantity for this product id
    return cartItems
      .filter((item) => item.id === id)
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  function resolveItemVariants(
    id: number,
    selectedVariants?: Record<string, string>
  ): Record<string, string> | undefined {
    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      return selectedVariants;
    }
    const product = (storeItems as unknown as Product[]).find((p) => p.id === id);
    if (product && product.variants && product.variants.length > 0) {
      return getDefaultVariants(product);
    }
    return undefined;
  }

  function increaseItemQuantity(
    id: number,
    selectedVariants?: Record<string, string>,
    deltaQuantity: number = 1
  ) {
    const effectiveVariants = resolveItemVariants(id, selectedVariants);
    const delta = Math.max(1, deltaQuantity);

    setCartItems((currItems) => {
      const existingItemIndex = currItems.findIndex(
        (item) => item.id === id && areVariantsEqual(item.selectedVariants, effectiveVariants)
      );

      if (existingItemIndex === -1) {
        return [...currItems, { id, quantity: delta, selectedVariants: effectiveVariants }];
      }

      return currItems.map((item, idx) => {
        if (idx === existingItemIndex) {
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      });
    });
  }

  function decreaseItemQuantity(
    id: number,
    selectedVariants?: Record<string, string>
  ) {
    setCartItems((currItems) => {
      const itemIndex = currItems.findIndex((item) => {
        if (item.id !== id) return false;
        if (selectedVariants !== undefined) {
          return areVariantsEqual(item.selectedVariants, selectedVariants);
        }
        return true;
      });

      if (itemIndex === -1) return currItems;

      const currentItem = currItems[itemIndex];
      if (currentItem.quantity <= 1) {
        return currItems.filter((_, idx) => idx !== itemIndex);
      }

      return currItems.map((item, idx) => {
        if (idx === itemIndex) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
    });
  }

  function removeFromCart(id: number, selectedVariants?: Record<string, string>) {
    setCartItems((currItems) => {
      if (selectedVariants !== undefined) {
        return currItems.filter(
          (item) => !(item.id === id && areVariantsEqual(item.selectedVariants, selectedVariants))
        );
      }
      return currItems.filter((item) => item.id !== id);
    });
  }

  function updateItemVariants(
    id: number,
    oldVariants: Record<string, string> | undefined,
    newVariants: Record<string, string>
  ) {
    if (areVariantsEqual(oldVariants, newVariants)) return;

    setCartItems((currItems) => {
      const targetIndex = currItems.findIndex(
        (item) => item.id === id && areVariantsEqual(item.selectedVariants, oldVariants)
      );
      if (targetIndex === -1) return currItems;

      const targetItem = currItems[targetIndex];

      // Check if an item already exists with the new variant combination
      const existingMatchIndex = currItems.findIndex(
        (item, idx) =>
          idx !== targetIndex &&
          item.id === id &&
          areVariantsEqual(item.selectedVariants, newVariants)
      );

      if (existingMatchIndex !== -1) {
        // Merge quantities and remove the old item
        return currItems
          .map((item, idx) => {
            if (idx === existingMatchIndex) {
              return { ...item, quantity: item.quantity + targetItem.quantity };
            }
            return item;
          })
          .filter((_, idx) => idx !== targetIndex);
      }

      // Simply update the variant mapping
      return currItems.map((item, idx) => {
        if (idx === targetIndex) {
          return { ...item, selectedVariants: newVariants };
        }
        return item;
      });
    });
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseItemQuantity,
        decreaseItemQuantity,
        removeFromCart,
        updateItemVariants,
        openCart,
        closeCart,
        isCartOpen: isOpen,
        cartItems,
        cartQuantity,
        clearCart,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}

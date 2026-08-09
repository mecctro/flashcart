import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

export interface CartStore {
  items: CartItem[];
  couponCode?: string;
  discountAmount: number;
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface CartStoreActions {
  addItem: (product: CartItem) => void;
  removeItem: (productId: string, selectedAttributes: Record<string, string>) => void;
  updateQuantity: (
    productId: string,
    selectedAttributes: Record<string, string>,
    quantity: number
  ) => void;
  clearCart: () => void;
  setCouponCode: (code: string) => void;
  setShipping: (amount: number) => void;
}

export type CartStoreWithActions = CartStore & CartStoreActions;

/**
 * Deep-compares two attribute objects to determine if a cart line
 * item represents the same variant of the same product.
 */
export function isSameVariant(
  attrsA: Record<string, string>,
  attrsB: Record<string, string>
): boolean {
  const keysA = Object.keys(attrsA).sort();
  const keysB = Object.keys(attrsB).sort();

  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => attrsA[key] === attrsB[key]);
}

/**
 * Generates a unique cart-item key from product ID + selected variant attributes.
 */
export function getCartItemKey(
  productId: string,
  selectedAttributes: Record<string, string> = {}
): string {
  const sortedKeys = Object.keys(selectedAttributes).sort();
  const attrString = sortedKeys
    .map((key) => `${key}:${selectedAttributes[key]}`)
    .join('|');

  return `${productId}::${attrString}`;
}

function computeTotals(
  items: CartItem[],
  discountAmount: number,
  tax: number,
  shipping: number
) {
  const subtotal = items.reduce(
    (sum, i) => sum + i.priceAtAdd * i.quantity,
    0
  );
  return {
    subtotal,
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    total: subtotal - discountAmount + tax + shipping,
  };
}

export const useCartStore = create<CartStoreWithActions>()(
  persist(
    (set) => ({
      items: [],
      couponCode: undefined,
      discountAmount: 0,
      totalItems: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,

      addItem: (item: CartItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) =>
              i.id === item.id &&
              isSameVariant(i.selectedAttributes, item.selectedAttributes)
          );

          let newItems: CartItem[];

          if (existingItem) {
            newItems = state.items.map((i) =>
              i === existingItem
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            newItems = [...state.items, item];
          }

          return {
            ...state,
            ...computeTotals(
              newItems,
              state.discountAmount,
              state.tax,
              state.shipping
            ),
            items: newItems,
          };
        });
      },

      removeItem: (productId: string, selectedAttributes: Record<string, string>) => {
        set((state) => {
          const newItems = state.items.filter(
            (i) =>
              !(
                i.id === productId &&
                isSameVariant(i.selectedAttributes, selectedAttributes)
              )
          );

          return {
            ...state,
            ...computeTotals(
              newItems,
              state.discountAmount,
              state.tax,
              state.shipping
            ),
            items: newItems,
          };
        });
      },

      updateQuantity: (
        productId: string,
        selectedAttributes: Record<string, string>,
        quantity: number
      ) => {
        set((state) => {
          const newItems = state.items.map((i) =>
            i.id === productId &&
            isSameVariant(i.selectedAttributes, selectedAttributes)
              ? { ...i, quantity }
              : i
          );

          return {
            ...state,
            ...computeTotals(
              newItems,
              state.discountAmount,
              state.tax,
              state.shipping
            ),
            items: newItems,
          };
        });
      },

      clearCart: () => ({
        items: [],
        couponCode: undefined,
        discountAmount: 0,
        totalItems: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
      }),

      setCouponCode: (code: string) => ({
        couponCode: code || undefined,
      }),

      setShipping: (amount: number) =>
        set((state) => ({
          ...state,
          shipping: amount,
          ...computeTotals(state.items, state.discountAmount, state.tax, amount),
        })),
    }),
    {
      name: 'flashcart-cart-storage',
    }
  )
);

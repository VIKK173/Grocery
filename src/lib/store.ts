import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string | null;
  badgeColor?: string | null;
  rating: number;
  reviews: number;
  inStock: boolean;
  unit: string;
  featured: boolean;
  nutrition?: string;
  tags?: string[];
  origin?: string;
  shelfLife?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

interface StoreState {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;

  // Cart
  cartItems: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Search
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Checkout
  isCheckoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  lastOrderId: string | null;
  setLastOrderId: (id: string | null) => void;
  lastOrderData: Record<string, unknown> | null;
  setLastOrderData: (data: Record<string, unknown> | null) => void;

  // Product Detail
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isProductDetailOpen: boolean;
  setProductDetailOpen: (open: boolean) => void;

  // Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),
      isAuthOpen: false,
      setAuthOpen: (open) => set({ isAuthOpen: open }),
      authMode: 'login',
      setAuthMode: (mode) => set({ authMode: mode }),

      // Cart
      cartItems: [],
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      addToCart: (product) => {
        const items = get().cartItems;
        const existing = items.find((i) => i.product._id === product._id);
        if (existing) {
          set({
            cartItems: items.map((i) =>
              i.product._id === product._id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ cartItems: [...items, { product, quantity: 1 }] });
        }
        get().showToast(`${product.name} added to cart!`, 'success');
      },
      removeFromCart: (productId) => {
        set({
          cartItems: get().cartItems.filter((i) => i.product._id !== productId),
        });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
        } else {
          set({
            cartItems: get().cartItems.map((i) =>
              i.product._id === productId ? { ...i, quantity } : i
            ),
          });
        }
      },
      clearCart: () => set({ cartItems: [] }),
      getCartTotal: () =>
        get().cartItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
      getCartCount: () =>
        get().cartItems.reduce((count, item) => count + item.quantity, 0),

      // Search
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Checkout
      isCheckoutOpen: false,
      setCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
      lastOrderId: null,
      setLastOrderId: (id) => set({ lastOrderId: id }),
      lastOrderData: null,
      setLastOrderData: (data) => set({ lastOrderData: data }),

      // Product Detail
      selectedProduct: null,
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      isProductDetailOpen: false,
      setProductDetailOpen: (open) => set({ isProductDetailOpen: open }),

      // Wishlist
      wishlist: [],
      toggleWishlist: (productId) => {
        const current = get().wishlist;
        if (current.includes(productId)) {
          set({ wishlist: current.filter((id) => id !== productId) });
        } else {
          set({ wishlist: [...current, productId] });
        }
      },

      // Toast
      toast: null,
      showToast: (message, type = 'success') => {
        set({ toast: { message, type } });
        setTimeout(() => set({ toast: null }), 3000);
      },
    }),
    {
      name: 'rivora-store',
      partialize: (state) => ({
        cartItems: state.cartItems,
        user: state.user,
        wishlist: state.wishlist,
      }),
    }
  )
);

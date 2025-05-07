import { createSlice } from "@reduxjs/toolkit";

type Product = {
  _id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  description: string;
  stock: number;
  category: string;
  photoUrl: string;
  __v: number;
  quantity: number;
};

const initialState: Product[] = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.find((item) => item._id === product._id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      return state.filter((item) => item._id !== action.payload);
    },
    increaseQuantity: (state, action) => {
      const product = state.find((item) => item._id === action.payload);
      if (product) {
        product.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const product = state.find((item) => item._id === action.payload);
      if (product && product.quantity > 1) {
        product.quantity -= 1;
      } else {
        return state.filter((item) => item._id !== action.payload);
      }
    },
    clearCart: () => {
      return [];
    },
    setCart: (state, action) => {
      return action.payload; // Replace state with fetched cart data
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  setCart,
} = cartSlice.actions;
export default cartSlice.reducer;

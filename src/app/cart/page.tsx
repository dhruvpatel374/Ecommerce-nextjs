"use client";

import React, { useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  setCart,
} from "@/utils/store/cartSlice";
import axios from "axios";
import Link from "next/link";

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

const Cart = () => {
  const cart = useSelector((store: { cart: Product[] }) => store.cart);
  const user = useSelector((store: { user: any }) => store.user);
  const isCartData = cart.length > 0;
  const dispatch = useDispatch();

  const calculateTotal = () => {
    return cart.reduce((total, product) => {
      const price =
        product.discountPrice && product.discountPrice < product.price
          ? product.discountPrice
          : product.price;
      return total + price * product.quantity;
    }, 0);
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/cart/getcart");
      const cartData = response.data.cart;
      dispatch(setCart(cartData));
      console.log("Cart fetched:", response.data);
    } catch (error: any) {
      console.log("Fetch cart error:", error.response?.data || error.message);
    }
  };

  const handleSaveCart = async (
    cartPayload: { productId: string; quantity: number }[]
  ) => {
    if (cartPayload.length === 0 && cart.length === 0) {
      console.log("Skipping save: Cart is empty");
      return;
    }

    try {
      const response = await axios.post(
        "/api/cart/save",
        { cart: cartPayload },
        { withCredentials: true }
      );
      console.log("Cart saved:", response.data);
    } catch (error: any) {
      console.log("Save cart error:", error.response?.data || error.message);
    }
  };

  const handleClearCart = async () => {
    try {
      await handleSaveCart([]);
      dispatch(clearCart());
      console.log("Cart cleared successfully");
    } catch (error: any) {
      console.log("Clear cart error:", error.response?.data || error.message);
    }
  };

  const handleIncreaseQuantity = async (productId: string) => {
    dispatch(increaseQuantity(productId));
    const cartPayload = cart.map((item) => ({
      productId: item._id,
      quantity: item._id === productId ? item.quantity + 1 : item.quantity,
    }));
    await handleSaveCart(cartPayload);
  };

  const handleDecreaseQuantity = async (productId: string) => {
    const product = cart.find((item) => item._id === productId);
    if (product && product.quantity > 1) {
      dispatch(decreaseQuantity(productId));
      const cartPayload = cart.map((item) => ({
        productId: item._id,
        quantity: item._id === productId ? item.quantity - 1 : item.quantity,
      }));
      await handleSaveCart(cartPayload);
    } else {
      dispatch(removeFromCart(productId));

      const cartPayload = cart
        .filter((item) => item._id !== productId)
        .map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        }));
      await handleSaveCart(cartPayload);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    dispatch(removeFromCart(productId));
    const cartPayload = cart
      .filter((item) => item._id !== productId)
      .map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));
    await handleSaveCart(cartPayload);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 flex justify-center">
      <div className="container max-w-6xl w-full">
        {/* Header */}
        <div
          className={`flex ${
            isCartData ? "justify-between" : "justify-center"
          } items-center mb-6`}
        >
          <h1 className="text-3xl font-bold text-white">Cart</h1>
          {cart.length > 0 && (
            <button
              onClick={handleClearCart}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:flex gap-8">
          {/* Cart Items */}
          <div className="lg:flex-1">
            <ul className="space-y-6">
              {cart.map((product) => (
                <li
                  key={product._id}
                  className="flex gap-4 bg-base-200 border border-gray-600 rounded-lg shadow-md p-4"
                >
                  <div className="sm:w-22 sm:h-22 w-30 h-30 flex-shrink-0">
                    <img
                      src={product.photoUrl}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  <div className="basis-9/12 flex flex-col justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {product.name}
                      </p>
                      <p className="text-gray-400 text-sm mt-1 truncate hidden md:block">
                        {product.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        {product.discountPrice &&
                        product.discountPrice < product.price ? (
                          <>
                            <p className="text-white font-semibold">
                              ₹{product.discountPrice.toFixed(2)}
                            </p>
                            <p className="text-gray-400 line-through text-sm">
                              ₹{product.price.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p className="text-white font-semibold">
                            ₹{product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => handleDecreaseQuantity(product._id)}
                        className="bg-white text-black px-2 py-1 rounded"
                      >
                        -
                      </button>
                      <p className="text-white font-semibold">
                        {product.quantity}
                      </p>
                      <button
                        onClick={() => handleIncreaseQuantity(product._id)}
                        className="bg-white text-black px-2 py-1 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveFromCart(product._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded flex items-center"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {cart.length === 0 && (
              <div className="flex justify-center items-center w-full min-h-[60vh] mt-6">
                <p className="text-lg text-gray-300">Your cart is empty.</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <div className="lg:basis-5/12 h-fit sticky top-40 p-6 rounded-lg border border-gray-600 shadow-md bg-base-200 mt-8 lg:mt-0">
              <h2 className="text-xl font-bold text-white border-b border-gray-600 pb-4">
                Order Summary
              </h2>
              <div className="py-4 text-lg space-y-4 border-b border-gray-600">
                <div className="flex justify-between items-center">
                  <p className="text-gray-300">Price ({cart.length} items)</p>
                  <p className="text-white font-semibold">
                    ₹{calculateTotal().toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-300">Discount (10%)</p>
                  <p className="text-white font-semibold">
                    -₹{(calculateTotal() * 0.1).toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-300">Delivery charges (5%)</p>
                  <p className="text-white font-semibold">
                    +₹{(calculateTotal() * 0.05).toFixed(2)}
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  You'll save ₹{(calculateTotal() * 0.1).toFixed(2)} on this
                  order 🎉
                </p>
              </div>
              <div className="py-4 border-b border-gray-600">
                <div className="flex justify-between items-center font-bold text-lg">
                  <h1 className="text-white">Total Amount</h1>
                  <h1 className="text-white">
                    ₹
                    {(
                      calculateTotal() -
                      calculateTotal() * 0.1 +
                      calculateTotal() * 0.05
                    ).toFixed(2)}
                  </h1>
                </div>
              </div>
              <Link href={user ? "/place-order" : "/login"}>
                <button className="w-full mt-4 uppercase font-bold text-lg bg-white text-black p-4 rounded-lg">
                  Place Order
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

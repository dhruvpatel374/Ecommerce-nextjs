"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

type Product = {
  _id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  quantity: number;
};

type User = {
  firstName: string;
  lastName: string;
  emailId: string;
};

const PlaceOrder = () => {
  const user = useSelector((store: { user: User }) => store.user);
  const cart = useSelector((store: { cart: Product[] }) => store.cart);

  const [address, setAddress] = useState({
    houseFlatNo: "",
    localityArea: "",
    cityTown: "",
    state: "",
    pincode: "",
  });
  const [fullName, setFullName] = useState(
    `${user?.firstName} ${user?.lastName}`
  );
  const [emailId, setEmailId] = useState(user?.emailId);

  // State for error message
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, product) => {
      const price =
        product.discountPrice && product.discountPrice < product.price
          ? product.discountPrice
          : product.price;
      return total + price * product.quantity;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = subtotal * 0.1;
    const delivery = subtotal * 0.05;
    return subtotal - discount + delivery;
  };

  const handleConfirmOrder = () => {
    if (
      !address.houseFlatNo ||
      !address.localityArea ||
      !address.cityTown ||
      !address.state ||
      !address.pincode
    ) {
      setError("Please fill in all address fields");
      return;
    }

    const orderData = {
      userId: user._id,
      products: cart.map((product) => ({
        productId: product._id,
        quantity: product.quantity,
      })),
      totalAmount: calculateTotal(),
      address: {
        houseFlatNo: address.houseFlatNo,
        localityArea: address.localityArea,
        cityTown: address.cityTown,
        state: address.state,
        pincode: address.pincode,
        country: "India",
      },
    };
    const response = axios.post("/api/order", orderData);
    toast.promise(
      response,
      {
        success: "Order Placed Successfully",
        loading: "Placing Order...",
        error: (error) => {
          return error.response?.data?.message;
        },
      },
      {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        success: {
          duration: 3000, // Success toast stays for 3 seconds
        },
        error: {
          duration: 4000, // Error toast stays for 4 seconds
        },
        position: "top-center",
      }
    );
    router.push("/orders");
  };

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 flex justify-center">
      <Toaster />
      <div className="container max-w-6xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Place Order</h1>
          <Link href="/cart">
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Back to Cart
            </button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="lg:flex gap-8">
          {/* Order Form */}
          <div className="lg:flex-1 bg-base-200 border border-gray-600 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-white border-b border-gray-600 pb-4 mb-4">
              Delivery Details
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
              {/* User Details */}
              <div>
                <label className="block text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  disabled
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={emailId}
                  disabled
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 cursor-not-allowed"
                />
              </div>
              {/* Address Fields */}
              <div>
                <label className="block text-gray-300 mb-1">
                  House/Flat No.
                </label>
                <input
                  type="text"
                  name="houseFlatNo"
                  value={address.houseFlatNo}
                  onChange={handleInputChange}
                  className="w-full bg-base-200 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Flat 101, ABC Apartments"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">
                  Locality/Area
                </label>
                <input
                  type="text"
                  name="localityArea"
                  value={address.localityArea}
                  onChange={handleInputChange}
                  className="w-full bg-base-200 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="MG Road, Koramangala"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">City/Town</label>
                <input
                  type="text"
                  name="cityTown"
                  value={address.cityTown}
                  onChange={handleInputChange}
                  className="w-full bg-base-200 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Bengaluru"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleInputChange}
                  className="w-full bg-base-200 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Karnataka"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleInputChange}
                  className="w-full bg-base-200 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="560001"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Country</label>
                <input
                  type="text"
                  value="India"
                  disabled
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 cursor-not-allowed"
                />
              </div>
            </div>
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
                    ₹{calculateSubtotal().toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-300">Discount (10%)</p>
                  <p className="text-white font-semibold">
                    -₹{(calculateSubtotal() * 0.1).toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-300">Delivery charges (5%)</p>
                  <p className="text-white font-semibold">
                    +₹{(calculateSubtotal() * 0.05).toFixed(2)}
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  You'll save ₹{(calculateSubtotal() * 0.1).toFixed(2)} on this
                  order 🎉
                </p>
              </div>
              <div className="py-4 border-b border-gray-600">
                <div className="flex justify-between items-center font-bold text-lg">
                  <h1 className="text-white">Total Amount</h1>
                  <h1 className="text-white">₹{calculateTotal().toFixed(2)}</h1>
                </div>
              </div>
              <button
                onClick={handleConfirmOrder}
                className="w-full mt-4 uppercase font-bold text-lg bg-white text-black p-4 rounded-lg"
              >
                Confirm Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;

"use client";

import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");

  const clearData = () => {
    setName("");
    setPrice("");
    setDiscountPrice("");
    setDescription("");
    setStock("");
    setCategory("");
    setPhotoUrl("");
    setError("");
  };

  const saveProduct = () => {
    const priceNum = parseFloat(price);
    const discountPriceNum = discountPrice ? parseFloat(discountPrice) : null;

    if (!name || !price || !description || !stock || !category) {
      setError("All fields except discount price are required");
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Price must be a positive number");
      return;
    }
    if (discountPrice && isNaN(discountPriceNum)) {
      setError("Discount price must be a valid number");
      return;
    }
    if (discountPriceNum !== null && discountPriceNum < 0) {
      setError("Discount price cannot be negative");
      return;
    }
    if (discountPriceNum !== null && discountPriceNum >= priceNum) {
      setError("Discount price must be less than original price");
      return;
    }
    if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      setError("Stock cannot be negative");
      return;
    }

    const productData = {
      name,
      price: priceNum,
      description,
      stock: parseInt(stock),
      category,
      photoUrl: photoUrl,
    };

    if (discountPriceNum !== null) {
      productData.discountPrice = discountPriceNum;
    }

    const saveProductPromise = axios.post("/api/admin/addproduct", productData);

    toast.promise(
      saveProductPromise,
      {
        loading: "Saving Product...",
        success: () => {
          clearData();
          return "Product added successfully";
        },
        error: (error) => {
          const message =
            error.response?.data?.message || "Failed to add product";
          setError(message);
          console.log("API error:", error.response?.data);
          return message;
        },
      },
      {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        success: {
          duration: 3000,
        },
        error: {
          duration: 4000,
        },
        position: "top-center",
      }
    );
  };

  return (
    <div className="flex justify-center my-10">
      <div className="md:w-[400px] mx-auto p-6 bg-base-200 rounded-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Add Product</h2>

        {/* Product Name */}
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-semibold mb-2">
            Product Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow-sm appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            placeholder="e.g., Wireless Headphones"
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label htmlFor="price" className="block text-sm font-semibold mb-2">
            Price (₹):
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="shadow-sm appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            placeholder="e.g., 7999"
            step="1"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="discountPrice"
            className="block text-sm font-semibold mb-2"
          >
            Discount Price (₹, optional):
          </label>
          <input
            type="number"
            id="discountPrice"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            className="shadow-sm appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            placeholder="e.g., 6399"
            step="1"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-semibold mb-2"
          >
            Description:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow-sm appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            placeholder="e.g., High-quality wireless headphones..."
            rows={4}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="stock" className="block text-sm font-semibold mb-2">
            Stock Quantity:
          </label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="shadow-sm appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            placeholder="e.g., 50"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="category"
            className="block text-sm font-semibold mb-2"
          >
            Category:
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="shadow-sm appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            placeholder="e.g., Electronics"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="photoUrl"
            className="block text-sm font-semibold mb-2"
          >
            Photo URL:
          </label>
          <input
            type="url"
            id="photoUrl"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="shadow-sm appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            placeholder="e.g., https://example.com/image.jpg"
          />
        </div>
        {error && (
          <div className="mb-6">
            <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-lg">
              {error}
            </p>
          </div>
        )}

        <div className="flex items-center justify-center">
          <button
            onClick={saveProduct}
            className="bg-white text-black py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

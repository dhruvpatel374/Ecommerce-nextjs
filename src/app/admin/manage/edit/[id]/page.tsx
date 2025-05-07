"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.post("/api/products/view", { _id: id });
        const product = res.data.product;

        setName(product[0].name || "");
        setPrice(product[0].price || "");
        setDiscountPrice(product[0].discountPrice ?? "");
        setDescription(product[0].description || "");
        setStock(product[0].stock || "");
        setCategory(product[0].category || "");
        setPhotoUrl(product[0].photoUrl || "");
      } catch (error) {
        console.log("Error fetching product:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleSave = () => {
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    const parsedDiscountPrice =
      discountPrice.trim() === "" ? undefined : Number(discountPrice);
    const saveProductPromise = axios.patch("/api/admin/editproduct", {
      _id: id,
      name,
      price: parsedPrice,
      discountPrice: parsedDiscountPrice,
      description,
      stock: parsedStock,
      category,
      photoUrl,
    });
    toast.promise(
      saveProductPromise,
      {
        loading: "Saving Product...",
        success: () => {
          setError("");
          return "Product updated successfully";
        },
        error: (error) => {
          const message = error.response?.data?.message;
          setError(message);
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
  if (isLoading) {
    return (
      <div className="flex justify-center my-10">
        <h2>
          <span className="loading loading-dots loading-lg text-white"></span>
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex justify-center items-center py-12">
      <div className="md:w-[500px] w-full mx-auto p-8 bg-base-200 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Edit Product
        </h2>

        {/* Image Preview */}
        <div className="mb-6 flex justify-center">
          <img
            src={
              photoUrl ||
              "https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?s=612x612&w=0&k=20&c=P1DebpeMIAtXj_ZbVsKVvg-duuL0v9DlrOZUvPG6UJk="
            }
            alt="Product Preview"
            className="w-32 h-32 object-cover rounded-lg border border-gray-600 shadow-md"
          />
        </div>

        {/* Product Name */}
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-sm font-semibold mb-2 text-gray-200"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product name"
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label
            htmlFor="price"
            className="block text-sm font-semibold mb-2 text-gray-200"
          >
            Price (₹)
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter price"
          />
        </div>

        {/* Discount Price */}
        <div className="mb-6">
          <label
            htmlFor="discountPrice"
            className="block text-sm font-semibold mb-2 text-gray-200"
          >
            Discount Price (₹, optional)
          </label>
          <input
            type="number"
            id="discountPrice"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter discount price"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-semibold mb-2 text-gray-200"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter description"
          />
        </div>

        {/* Stock */}
        <div className="mb-6">
          <label
            htmlFor="stock"
            className="block text-sm font-semibold mb-2 text-gray-200"
          >
            Stock Quantity
          </label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter stock quantity"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label
            htmlFor="category"
            className="block text-sm font-semibold mb-2 text-gray-200"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category"
          />
        </div>

        {/* Photo URL */}
        <div className="mb-6">
          <label
            htmlFor="photoUrl"
            className="block text-sm font-semibold mb-2 text-gray-200"
          >
            Photo URL
          </label>
          <input
            type="url"
            id="photoUrl"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter photo URL"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-lg">
              {error}
            </p>
          </div>
        )}

        {/* Buttons Placeholder */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={handleSave}
            className="py-3 px-8 rounded-lg text-black bg-white transition-all duration-300 transform hover:scale-105"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

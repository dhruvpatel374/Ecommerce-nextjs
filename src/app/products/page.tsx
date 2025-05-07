"use client";

import ProductCard from "@/components/ProductCard";
import ProductCardShimmer from "@/components/Shimmer/ProductCardShimmer";
import axios from "axios";
import React, { useEffect, useState } from "react";

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
};

const Products = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [buttonText, setButtonText] = useState("Add to Cart");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/products");
      setData(response.data.product);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = Array.from(
    new Set(data.map((product) => product.category))
  );

  const filteredAndSortedProducts = [...data]
    .filter((product) => {
      const query = searchQuery.toLowerCase();
      if (
        query &&
        !product.name.toLowerCase().includes(query) &&
        !product.description.toLowerCase().includes(query)
      ) {
        return false;
      }

      if (categoryFilter && product.category !== categoryFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      if (sortOrder === "high-to-low") {
        return priceB - priceA;
      }
      if (sortOrder === "low-to-high") {
        return priceA - priceB;
      }
      return 0;
    });

  const clearFilters = () => {
    setCategoryFilter("");
    setSortOrder("");
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:mx-24 mx-5">
        <ProductCardShimmer />
        <ProductCardShimmer />
        <ProductCardShimmer />
        <ProductCardShimmer />
        <ProductCardShimmer />
        <ProductCardShimmer />
        <ProductCardShimmer />
        <ProductCardShimmer />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-4 text-center m-5 text-white">
        Products
      </h1>

      {/* Filters and Search */}
      <div className="md:mx-24 mx-5 mb-6 bg-base-200 p-4 rounded-md shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or description..."
                className="select select-bordered w-full bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="select select-bordered w-full bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Sort Dropdown */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Sort by Price
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="select select-bordered w-full bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Default</option>
              <option value="high-to-low">Price: High to Low</option>
              <option value="low-to-high">Price: Low to High</option>
            </select>
          </div>
        </div>
        {/* Clear Filters Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={clearFilters}
            className="btn text-black bg-white border-none px-6 py-2"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:mx-24 mx-5">
        {filteredAndSortedProducts.length === 0 ? (
          <p className="text-center text-white col-span-full">
            No products match the selected filters or search
          </p>
        ) : (
          filteredAndSortedProducts.map((product: Product) => (
            <ProductCard
              key={product._id}
              product={product}
              buttonText={buttonText}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Products;

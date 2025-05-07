"use client";

import React from "react";

const ProductCardShimmer = () => {
  return (
    <div className="cursor-pointer border rounded-lg shadow-lg bg-base-200 animate-pulse">
      <div className="relative">
        <div className="w-full h-48 bg-gray-700 rounded-t-lg" />
      </div>
      <div className="p-4 space-y-2">
        <div className="h-5 bg-gray-600 rounded w-3/4" />
        <div className="flex space-x-2">
          <div className="h-4 bg-gray-600 rounded w-20" />
          <div className="h-4 bg-gray-500 rounded w-16" />
        </div>
        <div className="h-4 bg-gray-600 rounded w-full" />
        <div className="flex justify-between items-center mt-2">
          <div className="h-4 bg-gray-600 rounded w-24" />
          <div className="w-6 h-6 bg-gray-600 rounded-full" />
        </div>
        <div className="h-3 bg-gray-500 rounded w-32" />
        <div className="h-8 bg-gray-400 rounded w-full mt-2" />
      </div>
    </div>
  );
};

export default ProductCardShimmer;

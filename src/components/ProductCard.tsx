"use client";

import { addToCart } from "@/utils/store/cartSlice";
import { TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

type Product = {
  _id: string;
  name: string;
  price: number;
  discountPrice: number;
  description: string;
  stock: number;
  category: string;
  photoUrl: string;
  __v: number;
};

const ProductCard = ({
  product,
  buttonText,
  deleteButton,
}: {
  product: Product;
  buttonText: string;
  deleteButton?: boolean;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((store: { cart: Product[] }) => store.cart);

  const handleEdit = () => {
    if (buttonText === "Edit Product") {
      router.push(`/admin/manage/edit/${product._id}`);
    }
  };

  const deleteProduct = () => {
    const deleteProductPromise = axios.delete(`/api/admin/deleteproduct`, {
      data: { _id: product._id },
    });

    toast.promise(
      deleteProductPromise,
      {
        loading: "Deleting Product...",
        success: () => "Product deleted successfully",
        error: (error) => {
          const message =
            error.response?.data?.message || "Failed to delete product";
          console.log(error);
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

  const handleCart = async () => {
    // Add product to Redux store
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        photoUrl: product.photoUrl,
        discountPrice: product.discountPrice,
        description: product.description,
        category: product.category,
        quantity: 1, // Initial quantity
      })
    );
    toast.success("Item added to cart", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
      position: "top-center",
    });

    const updatedCart = cart.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
    }));

    const existingItem = updatedCart.find(
      (item) => item.productId === product._id
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({
        productId: product._id,
        quantity: 1,
      });
    }

    try {
      const response = await axios.post(
        "/api/cart/save",
        { cart: updatedCart },
        { withCredentials: true }
      );

      console.log("Cart saved:", response.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="border rounded-lg shadow-lg bg-base-200">
      <div className="relative">
        <img
          src={product.photoUrl}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold text-white">{product.name}</h2>
        <div className="flex items-center space-x-2">
          {product.discountPrice && product.discountPrice < product.price ? (
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

        <p className="text-gray-300 text-sm truncate">{product.description}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            {product.stock === 0 && (
              <p className="text-sm text-red-400">Out of Stock</p>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-sm text-yellow-400">
                Low Stock:{product.stock}
              </p>
            )}
            {product.stock > 5 && (
              <p className="text-sm text-green-400">In Stock:{product.stock}</p>
            )}
          </div>
        </div>
        <p className="text-gray-400 text-xs mt-1">
          Category: {product.category}
        </p>
        <div className="flex space-x-2 mt-2">
          {buttonText === "Edit Product" && (
            <button
              onClick={handleEdit}
              className="cursor-pointer flex-1 text-black bg-white py-1 px-3 rounded-md transition-colors duration-200"
            >
              {buttonText}
            </button>
          )}
          {buttonText === "Add to Cart" && (
            <button
              onClick={handleCart}
              className="cursor-pointer flex-1 text-black bg-white py-1 px-3 rounded-md transition-colors duration-200"
            >
              {buttonText}
            </button>
          )}

          {deleteButton && (
            <button
              onClick={deleteProduct}
              className="cursor-pointer flex-none text-white bg-red-500 py-1 px-3 rounded-md transition-colors duration-200"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

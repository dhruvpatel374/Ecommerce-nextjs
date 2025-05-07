"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Orders = () => {
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/order", {
        withCredentials: true,
      });
      setData(response.data.orders);
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 flex justify-center">
      <div className="container max-w-6xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Your Orders</h1>
        </div>

        {data.length === 0 ? (
          <p className="text-gray-300 text-center">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {data.map((order) => (
              <div
                key={order._id}
                className="bg-base-200 border border-gray-600 rounded-lg shadow-md p-6"
              >
                <div className="flex flex-wrap justify-between items-center mb-4">
                  <h2 className="text-md font-bold text-white">
                    Order #{order._id}
                  </h2>
                  <span
                    className={`text-sm font-semibold ${
                      order.status === "delivered"
                        ? "text-green-500"
                        : order.status === "cancelled"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-300">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-300">
                  Total: ₹{order.totalAmount.toFixed(2)}
                </p>
                <p className="text-gray-300">
                  Address: {order.address.houseFlatNo},{" "}
                  {order.address.localityArea}, {order.address.cityTown},{" "}
                  {order.address.state}, {order.address.pincode},{" "}
                  {order.address.country}
                </p>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-white">Products</h3>
                  <ul className="space-y-2 mt-2">
                    {order.products.map((product) => (
                      <li
                        key={product._id}
                        className="text-gray-300 flex items-center"
                      >
                        <img
                          src={product.productId.photoUrl}
                          alt={product.productId.name}
                          className="w-16 h-16 object-cover rounded mr-4"
                        />
                        <div>
                          <span className="font-semibold">
                            {product.productId.name}
                          </span>{" "}
                          - ₹
                          {(
                            product.productId.discountPrice ||
                            product.productId.price
                          ).toFixed(2)}{" "}
                          x {product.quantity}
                          <p className="text-sm text-gray-400">
                            {product.productId.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

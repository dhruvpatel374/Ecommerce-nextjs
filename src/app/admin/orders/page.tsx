"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Orders = () => {
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/admin/orders", {
        withCredentials: true,
      });
      setData(response.data.orders);
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = axios.patch(
        "/api/admin/orders",
        { _id: orderId, status: newStatus },
        { withCredentials: true }
      );
      setData((prevData) =>
        prevData.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.promise(
        response,
        {
          loading: "Updating status...",
          success: "Status updated successfully",
          error: "Failed to update status",
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
    } catch (error) {
      console.error("Error updating status:", error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 flex justify-center">
      <div className="container max-w-6xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Admin Orders</h1>
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
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="bg-gray-700 text-white border border-gray-600 rounded-lg px-2 py-1 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
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
                    {order.products.map((product) => {
                      const p = product.productId;
                      return (
                        <li
                          key={product._id}
                          className="text-gray-300 flex items-center"
                        >
                          <img
                            src={p.photoUrl}
                            alt={p.name}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                          <div>
                            <span className="font-semibold">{p.name}</span> - ₹
                            {(p.discountPrice || p.price).toFixed(2)} x{" "}
                            {product.quantity}
                            <p className="text-sm text-gray-400">
                              {p.description}
                            </p>
                          </div>
                        </li>
                      );
                    })}
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

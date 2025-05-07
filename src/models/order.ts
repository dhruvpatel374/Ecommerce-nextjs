import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],
    },
    totalAmount: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    },
    address: {
      houseFlatNo: {
        type: String,
        required: [true, "House/Flat No. is required"],
      },
      localityArea: {
        type: String,
        required: [true, "Locality/Area is required"],
      },
      cityTown: {
        type: String,
        required: [true, "City/Town is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      pincode: {
        type: String,
        required: [true, "Pincode is required"],
      },
      country: {
        type: String,
        default: "India",
      },
    },
  },
  { timestamps: true }
);
// delete mongoose.models.Order;
export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 20,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  discountPrice: {
    type: Number,
    // required: true,
    min: 1,
  },
  description: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 200,
  },
  stock: {
    type: Number,
    required: true,
    min: 1,
  },
  category: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
});

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

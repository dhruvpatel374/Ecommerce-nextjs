import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    lowercase: true,
    enum: {
      values: ["male", "female", "other"],
      message: `{VALUE} is not a valid gender`,
    },
  },
  photoUrl: {
    type: String,
    default: "https://openclipart.org/image/800px/346569",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },

  cart: {
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
    default: [], // Correctly set default for the array
  },
  // forgotPasswordToken: String,
  // forgotPasswordTokenExpiry: Date,
  // verifyToken: String,
  // verifyTokenExpiry: Date,
});

userSchema.methods.getJWT = function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  const token = jsonwebtoken.sign({ _id: user._id }, process.env.JWT_SECRET!);
  return token;
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);

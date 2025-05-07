import validator from "validator";
type Product = {
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  stock: number;
  category: string;
  photoUrl: string;
};
export const validateProduct = (product: Product) => {
  if (
    !product.name ||
    !product.price ||
    !product.description ||
    !product.stock ||
    !product.category ||
    !product.photoUrl
  ) {
    throw new Error("All fields are required");
  } else if (product.price < 1 || product.stock < 1) {
    throw new Error("Price and stock should be greater than 0");
  } else if (product.discountPrice && product.discountPrice < 1) {
    throw new Error("Discount price should be greater than 0");
  }
  if (product.discountPrice !== undefined) {
    if (product.discountPrice < 1) {
      throw new Error("Discount price should be greater than 0");
    } else if (product.discountPrice >= product.price) {
      throw new Error("Discount price should be less than price");
    }
  } else if (product.name.length < 3 || product.name.length > 20) {
    throw new Error("Name should be between 3 and 20 characters");
  } else if (
    product.description.length < 10 ||
    product.description.length > 200
  ) {
    throw new Error("Description should be between 10 and 200 characters");
  } else if (!validator.isURL(product.photoUrl)) {
    throw new Error("Please enter a valid URL");
  }
};

"use client";

import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import appStore from "./appStore";
import { addUser } from "./userSlice";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { addProduct } from "./productSlice";
import { setCart } from "./cartSlice";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const StoreWrapper = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const fetchCart = async () => {
      try {
        const response = await axios.get("/api/cart/getcart");
        const cartData = response.data.cart;
        dispatch(setCart(cartData));
        console.log("Cart fetched:", response.data);
      } catch (error: any) {
        console.log("Fetch cart error:", error.response?.data || error.message);
      }
    };
    useEffect(() => {
      const fetchUser = async () => {
        if (user) return;

        try {
          const res = await axios.get("/api/user/profile/view", {
            withCredentials: true,
          });
          dispatch(addUser(res.data.user));
          if (res.data.user.isAdmin) {
            router.push("/admin");
          } else {
            router.push("/profile");
          }
          fetchCart();
        } catch (err: any) {
          // if (err.response?.status === 401) {
          //   router.push("/login");
          // } else {
          //   console.error("User fetch failed:", err);
          // }
        }
      };
      const fetchProducts = async () => {
        try {
          const response = await axios.get("/api/products");
          dispatch(addProduct(response.data.product));
        } catch (error) {
          console.log("Error fetching products:", error);
        }
      };
      fetchProducts();
      fetchUser();
    }, [pathname]);

    return <>{children}</>;
  };

  return (
    <Provider store={appStore}>
      <StoreWrapper />
    </Provider>
  );
}

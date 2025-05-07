"use client";

import { removeUser } from "@/utils/store/userSlice";
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

type User = {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
  photoUrl: string;
  isAdmin: boolean;
  _id: string;
  __v: number;
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const user = useSelector((store: { user: User }) => store.user);
  const cart = useSelector((store: { cart: any }) => store.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Handle scroll for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    const logoutPromise = axios.get("/api/user/logout");

    toast.promise(
      logoutPromise,
      {
        loading: "Logging Out...",
        success: () => {
          dispatch(removeUser());
          router.push("/");
          return "Logout Successful";
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

  return (
    <>
      <Toaster />
      <nav
        className={`bg-base-200 ${
          isSticky
            ? "sticky top-4 z-40 rounded-xl mx-4 transition-all duration-300"
            : "relative"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-white font-bold font-ya text-2xl tracking-widest cursor-pointer"
              >
                Ecommerce
              </Link>
            </div>

            {/* Centered Navigation Links (Desktop) */}
            <div className="hidden gap-7 md:flex items-center justify-center">
              <Link
                href="/"
                className="text-white px-3 py-2 font-medium cursor-pointer"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-white px-3 py-2 font-medium cursor-pointer"
              >
                Products
              </Link>
              <Link
                href="/cart"
                className="text-white px-3 py-2 font-medium cursor-pointer"
              >
                Cart
                <span className="absolute top-[10px] right-[540px] bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              </Link>
            </div>

            <div className="flex items-center">
              {!user ? (
                <Link
                  href="/login"
                  className="text-white border tracking-widest border-gray-700 hover:border-gray-400 px-3 py-2 rounded-md font-medium cursor-pointer hidden md:block"
                >
                  Sign Up
                </Link>
              ) : (
                <div className="form-control flex items-center">
                  <div className="hidden sm:block self-center mr-2">
                    Welcome, {user.firstName}
                  </div>
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-ghost btn-circle avatar"
                    >
                      <div className="w-10 rounded-full">
                        <Image
                          alt={user.firstName + " photo"}
                          src={user.photoUrl}
                          width={10}
                          height={10}
                        />
                      </div>
                    </div>
                    <ul
                      tabIndex={0}
                      className="menu menu-sm dropdown-content rounded-box z-1 mt-3 w-36 p-2 shadow bg-base-200"
                    >
                      <li>
                        <Link href="/profile" className="justify-between">
                          Profile
                        </Link>
                      </li>
                      {user.isAdmin === false && (
                        <>
                          <li>
                            <Link href="/cart">Cart</Link>
                          </li>
                          <li>
                            <Link href="/orders" className="justify-between">
                              Order History
                            </Link>
                          </li>
                        </>
                      )}
                      {user.isAdmin && (
                        <>
                          <li>
                            <Link href="/admin/add" className="justify-between">
                              Add Product
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin/manage"
                              className="justify-between"
                            >
                              Manage Products
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/admin/orders"
                              className="justify-between"
                            >
                              Orders
                            </Link>
                          </li>
                        </>
                      )}
                      <li>
                        <a onClick={handleLogout}>Logout</a>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              <div
                onClick={toggleMenu}
                className="md:hidden cursor-pointer ml-4"
              >
                {!isOpen ? (
                  <Bars3BottomLeftIcon className="h-6 w-6 text-white" />
                ) : (
                  <XMarkIcon className="h-6 w-6 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-screen h-screen bg-base-100 transform transition-transform duration-300 ease-in-out z-50 shadow-xl md:hidden ${
            isOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="absolute top-4 right-4">
            <div onClick={toggleMenu} className="text-white cursor-pointer">
              <XMarkIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="px-2 pt-16 pb-3 space-y-8 sm:px-3 flex flex-col items-center justify-center h-full">
            <Link
              href="/"
              className="text-white block px-3 py-2 rounded-md text-lg font-medium w-full text-center cursor-pointer"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-white block px-3 py-2 rounded-md text-lg font-medium w-full text-center cursor-pointer"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              href="/products"
              className="text-white block px-3 py-2 rounded-md text-lg font-medium w-full text-center cursor-pointer"
              onClick={toggleMenu}
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="text-white block px-3 py-2 rounded-md text-lg font-medium w-full text-center cursor-pointer"
              onClick={toggleMenu}
            >
              cart
              <span className="absolute top-[410px] right-[110px] bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            </Link>
            {!user && (
              <Link
                href="/login"
                className="text-white border tracking-widest border-gray-700 hover:border-gray-400 px-3 py-2 rounded-md font-medium cursor-pointer"
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;

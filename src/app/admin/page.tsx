"use client";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

type User = {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
  photoUrl: string;
  gender: string;
  isAdmin: boolean;
  _id: string;
  __v: number;
};
const Admin = () => {
  const user = useSelector((store: { user: User }) => store.user);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-base-200">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Welcome, {user?.firstName}
      </h1>

      <div className="flex space-x-4">
        <Link href="/admin/add">
          <button className="bg-white py-3 px-6 rounded-lg text-black ">
            Add Product
          </button>
        </Link>
        <Link href="/admin/manage">
          <button className="bg-red-500 py-3 px-6 rounded-lg text-white">
            Manage Products
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Admin;

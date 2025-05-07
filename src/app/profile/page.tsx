"use client";

import { addUser } from "@/utils/store/userSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
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

const Profile = () => {
  const user = useSelector((store: { user: User }) => store.user);
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhotoUrl(user.photoUrl);
      setGender(user.gender || "male");
    }
  }, [user]);

  const [gender, setGender] = useState(user?.gender || "male");
  const saveProfile = () => {
    const saveProfilePromise = axios.patch("/api/user/profile/edit", {
      firstName,
      lastName,
      photoUrl,
      gender,
    });
    toast.promise(
      saveProfilePromise,
      {
        loading: "Saving Profile...",
        success: (response) => {
          dispatch(addUser(response.data.user));
          return "Profile updated successfully";
        },
        error: (error) => {
          const message = error.response?.data?.message;

          setError(message);
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
  return (
    <div className="flex justify-center my-10">
      <Toaster />
      <div className="md:flex md:space-x-6 gap-6">
        <div className="md:w-[400px] mx-auto p-6 bg-base-200 rounded-md shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Edit Profile
          </h2>

          {/* First Name */}
          <div className="mb-6">
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold mb-2"
            >
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* Last Name */}
          <div className="mb-6">
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold mb-2"
            >
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* Photo URL */}
          <div className="mb-6">
            <label
              htmlFor="photoUrl"
              className="block text-sm font-semibold mb-2"
            >
              Photo URL:
            </label>
            <input
              type="url"
              id="photoUrl"
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>

          {/* Gender */}
          <div className="mb-6">
            <label
              htmlFor="gender"
              className="block text-sm font-semibold mb-2"
            >
              Gender:
            </label>
            <select
              id="gender"
              className="h-10 shadow-sm appearance-none border rounded w-full px-3 bg-base-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option className="bg-base-200 text-white" value="male">
                Male
              </option>
              <option className="bg-base-200 text-white" value="female">
                Female
              </option>
              <option className="bg-base-200 text-white" value="other">
                Other
              </option>
            </select>
          </div>

          {/* About */}

          {/* Error message */}
          <p className="text-red-500 my-4">{error}</p>

          {/* Save Button */}
          <div className="flex items-center justify-center">
            <button
              className="bg-white text-black py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              onClick={saveProfile}
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

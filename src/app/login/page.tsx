"use client";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import validator from "validator";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addUser } from "@/utils/store/userSlice";
import { useRouter } from "next/navigation";

const Login = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [firstName, setFirstName] = useState("Kirtan");
  const [lastName, setLastName] = useState("Patel");
  const [emailId, setEmailId] = useState("kirtan@gmail.com");
  const [password, setPassword] = useState("Kirtan@123");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState({
    firstNameErr: "",
    lastNameErr: "",
    emailIdErr: "",
    passwordErr: "",
    generalErr: "",
  });
  const clearData = () => {
    setFirstName("");
    setLastName("");
    setEmailId("");
    setPassword("");
    setError({
      firstNameErr: "",
      lastNameErr: "",
      emailIdErr: "",
      passwordErr: "",
      generalErr: "",
    });
  };
  const validateForm = () => {
    let isValid = true;
    const newError = {
      firstNameErr: "",
      lastNameErr: "",
      emailIdErr: "",
      passwordErr: "",
      generalErr: "",
    };

    if (!isLogin) {
      if (!firstName) {
        newError.firstNameErr = "First Name is required";
        isValid = false;
      }
      if (!lastName) {
        newError.lastNameErr = "Last Name is required";
        isValid = false;
      }
    }
    if (!validator.isEmail(emailId)) {
      newError.emailIdErr = "Please enter a valid email address";
      isValid = false;
    }
    if (!password) {
      newError.passwordErr = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      newError.passwordErr = "Password should be at least 8 characters long";
      isValid = false;
    }
    setError(newError);
    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }
    toast.promise(
      axios.post("/api/user/signup", {
        firstName,
        lastName,
        emailId,
        password,
      }),
      {
        loading: "Signing up...",
        // success: "Signed up successfully",
        success: (response) => {
          dispatch(addUser(response.data.user));
          clearData();
          if (response.data.user.isAdmin) {
            router.push("/admin");
          } else {
            router.push("/profile");
          }
          return "Sign Up Successfully";
        },
        error: (error) => {
          const message = error.response?.data?.message;
          setError((prev) => ({
            ...prev,
            generalErr: message,
          }));
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
          duration: 3000, // Success toast stays for 3 seconds
        },
        error: {
          duration: 4000, // Error toast stays for 4 seconds
        },
        position: "top-center",
      }
    );
  };
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    const loginPromise = axios.post("/api/user/login", {
      emailId,
      password,
    });
    toast.promise(
      loginPromise,
      {
        loading: "Logging in...",
        success: (response) => {
          dispatch(addUser(response.data.user));
          clearData();
          if (response.data.user.isAdmin == true) {
            router.push("/admin");
          } else {
            router.push("/profile");
          }
          return "Login Successful";
        },
        error: (error) => {
          const message = error.response?.data?.message;
          setError((prev) => ({
            ...prev,
            generalErr: message,
          }));
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
          duration: 3000, // Success toast stays for 3 seconds
        },
        error: {
          duration: 4000, // Error toast stays for 4 seconds
        },
        position: "top-center",
      }
    );
  };
  return (
    <>
      <Toaster />
      <div className="flex justify-center items-center m-5 bg-base-100">
        <div className="bg-[#ffffff19] p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-semibold text-center mb-4">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          <form onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm mb-1">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  className="border rounded w-full p-2"
                  placeholder="Enter your First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {error.firstNameErr && (
                  <p className="text-red-500 text-sm mt-1">
                    {error.firstNameErr}
                  </p>
                )}
              </div>
            )}

            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm mb-1">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="border rounded w-full p-2"
                  placeholder="Enter your Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {error.lastNameErr && (
                  <p className="text-red-500 text-sm mt-1">
                    {error.lastNameErr}
                  </p>
                )}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="border rounded w-full p-2"
                placeholder="Enter your email address"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
              {error.emailIdErr && (
                <p className="text-red-500 text-sm mt-1">{error.emailIdErr}</p>
              )}
            </div>

            <div className="mb-4 relative">
              <label className="block text-sm mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="border rounded w-full p-2 pr-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {error.passwordErr && (
              <p className="text-red-500 text-sm mt-1">{error.passwordErr}</p>
            )}
            {error.generalErr && (
              <div className="mb-6">
                <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-lg">
                  {error.generalErr}
                </p>
              </div>
            )}
            <button
              type="submit"
              className="bg-white text-black p-2 rounded-md w-full cursor-pointer"
              onClick={isLogin ? handleLogin : handleSignUp}
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;

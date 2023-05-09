import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

import { app } from "../../firebase";
import { signUpSchema } from "../../common/auth/validation";

import { LoadingIcon, Logo } from "../../common/assets/icons";
import { useNotifications } from "reapop";

export const SignupPage = () => {
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);
  const { notify } = useNotifications();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signUpSchema) });

  const onSubmit = (data) => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, data?.email, data?.password)
      .then(() => {
        navigate("/sign-in");
        notify("Account created successfully! Please login", "success");
        setLoading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        notify(errorMessage, "error");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="bg-gray-800 text-white w-1/2 h-screen hidden md:flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center my-8">
            <Logo />
          </div>
          <p className="text-xl mb-8">
            Create an account and get started with our chat application
          </p>
          <p className="text-xl">Enjoy the benefits and features we offer!</p>
        </div>
      </div>

      <div className="bg-white w-full md:w-1/2 h-screen flex items-center justify-center">
        <div className="w-2/3">
          <h2 className="text-3xl font-bold mb-4 text-center">Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:border-blue-500"
                {...register("email")}
              />
              <p className="errorMessage">{errors?.email?.message}</p>
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:border-blue-500"
                autoComplete="false"
                {...register("password")}
              />
              <p className="errorMessage">{errors?.password?.message}</p>
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-bold mb-2"
              >
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:border-blue-500"
                autoComplete="false"
                {...register("confirmPassword")}
              />
              <p className="errorMessage">{errors?.confirmPassword?.message}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-700">
                Already have an account?{" "}
                <Link className="text-blue-500" to="/sign-in">
                  Sign-in
                </Link>
              </p>
            </div>
            {loading ? (
              <div className="flex justify-center items-center">
                <LoadingIcon />
              </div>
            ) : (
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Sign-up
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

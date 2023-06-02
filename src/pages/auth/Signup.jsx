import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

import { app } from "../../firebase";
import { signUpSchema } from "../../common/auth/validation";

import { LoadingIcon, Logo } from "../../common/assets/icons";
import { useNotifications } from "reapop";
import mobileImg from "../../common/assets/images/mobile.png";

export const SignupPage = () => {
  const auth = getAuth(app);
  const db = getFirestore();
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
      .then((userCredential) => {
        notify("Account created successfully! Please login", "success");
        setLoading(false);
        navigate("/sign-in");
        const writeUserData = (userId, name, email) => {
          setDoc(doc(db, "users", userId), {
            username: name,
            email: email,
            id: userId,
            setLogin: false,
          });
        };
        writeUserData(userCredential?.user?.uid, data?.userName, data?.email);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setLoading(false);
        notify(errorMessage, "error");
      });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr]">
      <div className="bg-gray-800 rounded-bl-[40%] rounded-br-[40%] md:rounded-tr-[40%] md:rounded-bl-[0] md:rounded-br-[40%]">
        <div className="flex items-center justify-center md:justify-between h-96 relative md:min-h-screen">
          <div className="w-[100%] sm:w-[60%] m-5">
            <img src={mobileImg} alt="mobileImg" />
          </div>
          <div className="h-28 w-28 bg-blue-50 rounded-full grid place-content-center absolute -bottom-14 md:-right-14 md:bottom-auto">
            <Logo />
          </div>
        </div>
      </div>

      <div className="bg-white w-full my-16 flex items-center justify-center">
        <div className="w-2/3">
          <h2 className="text-3xl font-bold mb-4 text-center">Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                Username:
              </label>
              <input
                type="text"
                id="userName"
                className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:border-blue-500"
                {...register("userName")}
              />
              <p className="errorMessage">{errors?.userName?.message}</p>
            </div>
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

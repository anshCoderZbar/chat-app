import React, { useState } from "react";
import { app } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNotifications } from "reapop";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

import { AppContext } from "../../store";
import { loginSchema } from "../../common/auth/validation";

import { LoadingIcon, Logo } from "../../common/assets/icons";
export const LoginPage = () => {
  const db = getFirestore();
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);
  const { notify } = useNotifications();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });
  const { setUserDetails } = AppContext();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, data?.email, data?.password)
      .then((userCredential) => {
        const user = userCredential.user;
        sessionStorage.setItem(
          "userData",
          JSON.stringify({
            accessToken: user?.accessToken,
            uid: user?.uid,
            login: true,
          })
        );

        setUserDetails(auth);
        navigate("/");
        notify("Welcome back", "success");
        const docRef = doc(db, "users", user?.uid);
        const loginStatus = {
          setLogin: true,
        };
        updateDoc(docRef, loginStatus)
          .then((res) => {
            console.log("status updated");
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
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
            Sign-in your account and get started with our chat application
          </p>
          <p className="text-xl">Enjoy the benefits and features we offer!</p>
        </div>
      </div>

      <div className="bg-white w-full md:w-1/2 h-screen flex items-center justify-center">
        <div className="w-2/3">
          <h2 className="text-3xl font-bold mb-4 text-center">Sign In</h2>
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
              <p className="text-gray-700">
                Don't have an account?{" "}
                <Link className="text-blue-500" to="/sign-up">
                  Sign-up
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

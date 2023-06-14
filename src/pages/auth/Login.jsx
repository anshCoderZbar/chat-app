import React, { useEffect, useState } from "react";
import { app } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNotifications } from "reapop";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

import { AppContext } from "../../store";
import { loginSchema } from "../../common/auth/validation";

import { LoadingIcon } from "../../common/assets/icons";
import { AuthBanner } from "../../components/AuthBanner";

export const LoginPage = () => {
  const db = getFirestore();
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState({ initial: true, loginForm: false });
  useEffect(() => {
    let status = sessionStorage.getItem("status");
    if (status) {
      setTab({ initial: false, loginForm: true });
    }
    return;
  }, []);

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
    <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr]">
      <AuthBanner />
      {tab && tab.initial && (
        <div className="bg-white w-full mt-20 md:h-[90vh] flex items-center justify-center transition ease-in-out duration-1000	">
          <div className="text-center">
            <p className="text-xl my-8 md:mb-8">
              Click here to login into your account
            </p>
            <button
              onClick={() => {
                setTab({ initial: false, loginForm: true });
                sessionStorage.setItem("status", true);
              }}
              className="bg-gray-700 py-3 px-7 rounded-full font-semibold text-white hover:bg-gray-800 mb-5"
            >
              Get Started Now!
            </button>
          </div>
        </div>
      )}

      {tab && tab?.loginForm && (
        <div className="bg-white w-full mt-16 md:h-[90vh] flex items-center justify-center transition ease-in-out duration-1000	">
          <div className="w-2/3">
            <h2 className="text-3xl font-bold mb-4 text-center">Sign In</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-bold m-2"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="myname@example.com"
                  className="w-full border text-sm md:text-base border-gray-400 py-2 px-3 rounded-full focus:outline-none focus:border-blue-500 placeholder:text-sm"
                  {...register("email")}
                />
                <p className="errorMessage">{errors?.email?.message}</p>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-bold m-2"
                >
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="********"
                  className="w-full border text-sm md:text-base border-gray-400 py-2 px-3 rounded-full focus:outline-none focus:border-blue-500 placeholder:text-sm"
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
                  className="bg-gray-800 hover:bg-gray-900 mb-4 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full"
                >
                  Sign-up
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

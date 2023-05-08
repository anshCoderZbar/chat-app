import React, { useState } from "react";
import { Logo } from "../../common/assets/icons";

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "../../firebase";

export const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const auth = getAuth(app);

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Signup error: ", errorCode, errorMessage);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="bg-gray-800 text-white w-1/2 h-screen flex items-center justify-center">
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

      <div className="bg-white w-1/2 h-screen flex items-center justify-center">
        <div className="w-2/3">
          <h2 className="text-3xl font-bold mb-8 text-center">Signup</h2>
          <form onSubmit={handleSubmit}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:border-blue-500"
                required
              />
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:border-blue-500"
                autoComplete="false"
              />
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:border-blue-500"
                autoComplete="false"
              />
            </div>
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

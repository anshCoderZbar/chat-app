import React from "react";
import { Logo } from "../../assets/icons";
import { Link, useNavigate } from "react-router-dom";
import { doc, getFirestore, updateDoc } from "@firebase/firestore";

export const Header = () => {
  const db = getFirestore();

  const navigate = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  const handleLogout = () => {
    sessionStorage?.removeItem("userData");
    navigate("/sign-in");
    const docRef = doc(db, "users", userData.uid);
    const loginStatus = {
      setLogin: false,
    };
    updateDoc(docRef, loginStatus)
      .then((res) => {
        console.log("status updated");
      })
      .catch((err) => console.log(err));
  };

  return (
    <nav className="bg-gray-800 fixed w-full z-50 py-4 px-6 flex justify-between items-center">
      <Link to="/" className="flex items-center">
        <Logo />
        <h1 className="text-white text-xl font-bold">LetsTalk</h1>
      </Link>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </nav>
  );
};

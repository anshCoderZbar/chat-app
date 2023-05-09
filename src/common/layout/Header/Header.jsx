import React from "react";
import { Logo } from "../../assets/icons";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage?.removeItem("userData");
    navigate("/sign-in");
  };
  return (
    <nav className="bg-gray-800 fixed w-full z-50 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <Logo />
        <h1 className="text-white text-xl font-bold">LetsTalk</h1>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </nav>
  );
};

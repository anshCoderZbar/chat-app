import React from "react";
import { Header } from "./Header/Header";
// import { Footer } from "./Footer/Footer";

export const MasterLayout = ({ children }) => {
  return (
    <div className="md:flex">
      <Header />
      {children}
      {/* <Footer /> */}
    </div>
  );
};

import React from "react";
import { PrivateRoutes } from "./private";
import { Home } from "../pages/index";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignupPage } from "../pages/auth/Signup";
import { PublicRoutes } from "./public";

export const AllRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/sign-up"
          element={
            <PublicRoutes restricted={false}>
              <SignupPage />
            </PublicRoutes>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoutes>
              <Home />
            </PrivateRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

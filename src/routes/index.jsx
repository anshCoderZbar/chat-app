import React from "react";
import { PrivateRoutes } from "./private";
import { Home } from "../pages/index";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignupPage } from "../pages/auth/Signup";
import { PublicRoutes } from "./public";
import { LoginPage } from "../pages/auth/Login";

export const AllRoutes = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/sign-up"
          element={
            <PublicRoutes restricted={props.token}>
              <SignupPage />
            </PublicRoutes>
          }
        />
        <Route
          exact
          path="/sign-in"
          element={
            <PublicRoutes restricted={props.token}>
              <LoginPage />
            </PublicRoutes>
          }
        />
        <Route
          exact
          path="/"
          element={
            <PrivateRoutes>
              <Home />
            </PrivateRoutes>
          }
        />
        <Route
          exact
          path="/:id"
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

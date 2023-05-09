import React from "react";
import { Navigate } from "react-router-dom";
import { MasterLayout } from "../../common/layout";

export const PrivateRoutes = ({ children }) => {
  const authData = JSON.parse(sessionStorage.getItem("userData"));
  return (
    <>
      {authData?.accessToken ? (
        <MasterLayout>{children}</MasterLayout>
      ) : (
        <Navigate to="/sign-in" />
      )}
    </>
  );
};

import React from "react";
import { Navigate } from "react-router-dom";
import { MasterLayout } from "../../common/layout";

export const PrivateRoutes = ({ children }) => {
  const auth = false;
  return (
    <>
      {auth ? (
        <MasterLayout>{children}</MasterLayout>
      ) : (
        <Navigate to="/sign-up" />
      )}
    </>
  );
};

import React from "react";
import { Navigate } from "react-router-dom";

export const PublicRoutes = ({ restricted, children }) => {
  return <>{restricted ? <Navigate to="/" /> : children}</>;
};

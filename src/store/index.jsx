import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext({});

export const Store = ({ children }) => {
  const [userDetails, setUserDetails] = useState({});
  const [toggle, setToggle] = useState(false);
  const [auth, setAuth] = useState(() => {
    const authData = JSON.parse(sessionStorage.getItem("userData"));
    return authData || {};
  });

  useEffect(() => {
    sessionStorage.setItem("userData", JSON.stringify(auth));
    setAuth(() => auth);
  }, []);

  return (
    <UserContext.Provider
      value={{ userDetails, setUserDetails, auth, toggle, setToggle }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const AppContext = () => useContext(UserContext);

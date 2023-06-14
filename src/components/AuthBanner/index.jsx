import React from "react";

import mobileImg from "../../common/assets/images/mobile.png";
import { Logo } from "../../common/assets/icons";

export const AuthBanner = () => {
  return (
    <div className="bg-gray-800 shadow-lg rounded-bl-[40%] rounded-br-[40%] md:rounded-tr-[40%] md:rounded-bl-[0] md:rounded-br-[40%]">
      <div className="flex items-center justify-center md:justify-between h-96 relative md:min-h-screen">
        <div className="w-[100%] sm:w-[60%] m-5">
          <img src={mobileImg} alt="mobileImg" />
        </div>
        <div className="h-28 w-28 bg-blue-50 rounded-full shadow-xl grid place-content-center absolute -bottom-14 md:-right-14 md:bottom-auto">
          <Logo />
        </div>
      </div>
    </div>
  );
};

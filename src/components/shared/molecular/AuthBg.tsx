"use client";
import React, { ReactNode, useEffect, useState } from "react";
import desktop from "../../../../public/auth/desktop_bg.svg";
import mackbook from "../../../../public/auth/macbook_bg.svg";
import mobile from "../../../../public/auth/mob_bg.svg";

const AuthBg = ({ children }: { children: ReactNode }) => {
  const [bgImg, setBgImg] = useState(desktop.src);
  const handleResize = () => {
    if (window.innerWidth > 1280) setBgImg(desktop.src);
    else if (window.innerWidth > 430) setBgImg(mackbook.src);
    else setBgImg(mobile.src);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      className="bg-cover bg-center h-screen flex justify-center items-center flex-col"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {children}
    </div>
  );
};

export default AuthBg;

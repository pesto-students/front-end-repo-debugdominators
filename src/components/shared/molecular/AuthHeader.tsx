import { abel, yanone } from "@/utils/helpers/fonts";
import { AuthHeaderProps } from "@/utils/types/html";
import React from "react";

const AuthHeader = ({ header, subheader }: AuthHeaderProps) => {
  return (
    <>
      <h1 className={`${yanone.className} text-6xl mb-5`}>{header}</h1>
      <p className={`${abel.className} text-xl mb-5`}>{subheader}</p>
    </>
  );
};

export default AuthHeader;

import SocialButtons from "@/components/shared/molecular/SocialButtons";
import { clientEndPointsAuth } from "@/constants/uri";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <>
      <div className="mt-3 font-bold flex flex-col md:flex-col items-center lg:flex-row lg:justify-around">
        {/* <div className="cursor-pointer">Forgot password?</div> */}
        <div className="cursor-pointer">
          <Link href={clientEndPointsAuth.REGISTER}>go to register?</Link>
        </div>
      </div>
      <p className="mt-5 mb-5 text-center">or continue with</p>
      <div className="flex w-[100%]">
        <SocialButtons />
      </div>
    </>
  );
};

export default Footer;

import { Input } from "antd";
import { signIn } from "next-auth/react";
import React from "react";

const SocialButtons = () => {
  const handleLogin = async (service: string) => {
    if (service === "google")
      await signIn("google", { callbackUrl: "/dashboard" });
    if (service === "microsoft")
      await signIn("azure-ad", { callbackUrl: "/dashboard" });
  };
  return (
    <div className="w-full mt-3 font-bold flex flex-col md:flex-col lg:flex-row justify-between content-between">
      <Input
        className="mb-3"
        style={{
          cursor: "pointer",
          background: "#0000",
          border: "2px solid #000",
          borderRadius: "0",
          height: "40px",
          fontWeight: "bold",
        }}
        value="Google"
        onClick={() => handleLogin("google")}
        type="button"
      />
      <div className="pl-2 pr-2"></div>
      <Input
        style={{
          cursor: "pointer",
          background: "#0000",
          border: "2px solid #000",
          borderRadius: "0",
          height: "40px",
          fontWeight: "bold",
        }}
        value="Microsoft"
        onClick={() => handleLogin("microsoft")}
        type="button"
      />
    </div>
  );
};

export default SocialButtons;

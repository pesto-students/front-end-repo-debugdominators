"use client";
import { useState } from "react";
import Inputs from "@/components/auth/login/Inputs";
import AuthBg from "@/components/shared/molecular/AuthBg";
import Header from "@/components/auth/login/Header";
import Footer from "@/components/auth/login/Footer";
import { signIn } from "next-auth/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signIn("credentials", {
        callbackUrl: "/dashboard",
        email,
        password,
      });
    } catch (error: unknown) {
      throw new Error(JSON.stringify(error));
    }
  };

  return (
    <AuthBg>
      <Header />
      <form className="flex flex-row justify-between items-center w-[40%]">
        <Inputs
          mail={email}
          setMail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleLogin}
        />
      </form>
      <div className="w-[40%] flex flex-col justify-center">
        <Footer />
      </div>
    </AuthBg>
  );
};

export default Login;

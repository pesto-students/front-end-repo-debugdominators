"use client";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { clientEndPointsAuth, serverEndPointsAuth } from "@/constants/uri";
import { useRouter } from "next/navigation";
import AuthBg from "@/components/shared/molecular/AuthBg";
import Header from "@/components/auth/register/Header";
import Inputs from "@/components/auth/register/Inputs";
import Footer from "@/components/auth/register/Footer";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { LOGIN } = clientEndPointsAuth;
  const router = useRouter();
  const handleRegister = async () => {
    try {
      const response: AxiosResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}${serverEndPointsAuth.REGISTER}`,
        { name: username, email, password },
      );
      if (response.data.success) router.push(LOGIN);
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  };

  return (
    <AuthBg>
      <Header />
      <form className="flex flex-row justify-between items-center w-[40%]">
        <Inputs
          username={username}
          setUsername={setUsername}
          mail={email}
          setMail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleRegister}
        />
      </form>
      <div className="w-[40%] flex flex-col justify-center">
        <Footer />
      </div>
    </AuthBg>
  );
};

export default Register;

{
  /* <div>
<h1>Register</h1>
<form>
  <label>
    Username:
    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
  </label>
  <br />
  <label>
    Email:
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </label>
  <br />
  <label>
    Password:
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </label>
  <br />
  <button type="button" onClick={handleRegister}>
    Register
  </button>
</form>
<button type="button">
  <Link href={LOGIN}>go to login</Link>
</button>
</div> */
}

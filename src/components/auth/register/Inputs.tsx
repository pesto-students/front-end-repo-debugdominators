import InputButton from "@/components/shared/atomic/InputButton";
import InputWithoutLabel from "@/components/shared/atomic/InputWithoutLabel";
import { registerInputProps } from "@/utils/types/html";
import React from "react";

const Inputs: React.FC<registerInputProps> = ({
  username,
  setUsername,
  mail,
  setMail,
  password,
  setPassword,
  handleSubmit,
}) => {
  return (
    <div style={{ width: "100%" }}>
      <div className="mb-2">
        <InputWithoutLabel
          placeholder={"Enter your username"}
          value={username}
          setValue={setUsername}
          type={"text"}
          name={"username"}
        />
      </div>
      <div className="mb-2">
        <InputWithoutLabel
          placeholder={"Enter your email"}
          value={mail}
          setValue={setMail}
          type={"text"}
          name={"email"}
        />
      </div>
      <InputWithoutLabel
        placeholder={"Enter your passsord"}
        value={password}
        setValue={setPassword}
        type={"password"}
        name={"password"}
      />
      <div className="mt-5">
        <InputButton handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Inputs;

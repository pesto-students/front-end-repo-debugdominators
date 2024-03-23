import { submitButton } from "@/utils/styles/auth";
import { ClickProps } from "@/utils/types/html";
import { Input } from "antd";
import React from "react";

const InputButton: React.FC<ClickProps> = ({ handleSubmit }) => {
  return (
    <>
      <Input
        style={submitButton}
        value="Sign In"
        onClick={handleSubmit}
        type="button"
      />
    </>
  );
};

export default InputButton;

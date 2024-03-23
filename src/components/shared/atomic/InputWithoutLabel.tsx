import React from "react";
import {
  InfoCircleOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import { InputPropsChild } from "@/utils/types/html";
import { input } from "@/utils/styles/auth";

const InputWithoutLabel: React.FC<InputPropsChild> = ({
  placeholder,
  value,
  setValue,
  type,
  name,
}) => {
  let prefix: string | JSX.Element = <></>;
  let suffix: JSX.Element = <></>;
  if (name === "email") {
    prefix = <MailOutlined className="site-form-item-icon" />;
    suffix = (
      <Tooltip title="Email should be unique and registered">
        <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
      </Tooltip>
    );
  } else if (name === "password") {
    prefix = "￥";
    suffix = (
      <Tooltip title="Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and length shoud be minimum 6 character">
        <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
      </Tooltip>
    );
  } else if (name === "username") {
    prefix = <UserOutlined />;
    suffix = (
      <Tooltip title="Write your username">
        <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
      </Tooltip>
    );
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <>
      <Input
        style={input}
        placeholder={placeholder}
        value={value}
        onChange={handleValueChange}
        type={type}
        prefix={prefix}
        suffix={suffix}
      />
    </>
  );
};

export default InputWithoutLabel;

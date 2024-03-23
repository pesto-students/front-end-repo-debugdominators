import React from "react";
import { Input } from "antd";
import { TextAreaField } from "@/utils/types/state";

const { TextArea } = Input;

const AntTextArea: React.FC<TextAreaField> = ({
  setHeading,
  placeholder,
  value,
}) => {
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHeading(e.target.value);
  };
  return (
    <TextArea
      value={value}
      placeholder={placeholder}
      allowClear
      onChange={onChange}
    />
  );
};

export default AntTextArea;

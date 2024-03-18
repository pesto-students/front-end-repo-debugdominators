import { AntButtonProps } from "@/utils/types/state";
import { Button } from "antd";
import React from "react";

const AntButton: React.FC<AntButtonProps> = ({
  name = "submit",
  type = "dashed",
  style = { background: "red" },
  handleSubmit,
}) => {
  return (
    <>
      <Button style={style} onClick={handleSubmit} type={type} block>
        {name}
      </Button>
    </>
  );
};

export default AntButton;

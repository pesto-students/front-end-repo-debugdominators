import React from "react";
import { Alert } from "antd";
import { AntAlertProps } from "@/utils/types/state";

const AntAlert: React.FC<AntAlertProps> = ({
  message = "Error",
  description = "",
  type = "error",
  isShowIcon = true,
  handleClick,
}) => (
  <Alert
    message={message}
    description={description}
    type={type}
    showIcon={isShowIcon}
    onClick={handleClick}
  />
);

export default AntAlert;

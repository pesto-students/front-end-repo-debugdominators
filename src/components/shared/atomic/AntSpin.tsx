import React from "react";
import { Spin } from "antd";
import { AntSpinProps } from "@/utils/types/state";

const AntSpin: React.FC<AntSpinProps> = ({ tip, size = "small" }) => (
  <Spin tip={tip} size={size}>
    <div className="conetent" />
  </Spin>
);

export default AntSpin;

import { Image } from "antd";
import React from "react";
import { staticImgLinks } from "@/constants/uri";

const Picture: React.FC = () => {
  return (
    <Image
      width={400}
      height={400}
      style={{ borderRadius: "0px 25% 0px 0px" }}
      src={staticImgLinks.NO_IMG}
      alt="no-image"
    />
  );
};

export default Picture;

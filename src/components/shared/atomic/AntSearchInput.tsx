import React from "react";
import { Input } from "antd";
import { AntSearchInputProps } from "@/utils/types/state";

const { Search } = Input;

const AntSearchInput: React.FC<AntSearchInputProps> = ({
  placeholder = "Search Unsplash Images",
  buttonName = "Search",
  size = "large",
  isLoading = true,
  allowClear = true,
  handleChange,
  handleClick,
  count,
}) => {
  let countObj = {};
  if (count) countObj = { show: true, max: 20 };
  return (
    <>
      <Search
        onChange={(e) => handleChange(e.target.value)}
        onClick={handleClick}
        placeholder={placeholder}
        enterButton={buttonName}
        size={size}
        loading={isLoading}
        allowClear={allowClear}
        count={countObj}
      />
    </>
  );
};

export default AntSearchInput;

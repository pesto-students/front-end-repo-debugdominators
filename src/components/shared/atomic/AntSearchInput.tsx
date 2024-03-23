import React from "react";
import { Button, Input } from "antd";
import { AntSearchInputProps } from "@/utils/types/state";

const AntSearchInput: React.FC<AntSearchInputProps> = ({
  placeholder = "Search Unsplash Images",
  size = "large",
  allowClear = true,
  isButton = true,
  value,
  handleChange,
  handleClick,
  count,
}) => {
  let countObj = {};
  if (count) countObj = { show: true, max: 20 };
  return (
    <div className="flex h-8">
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        size={size}
        allowClear={allowClear}
        count={countObj}
      />
      {isButton && (
        <Button
          className="ml-2"
          type="primary"
          onClick={handleClick && handleClick}
        >
          Search
        </Button>
      )}
    </div>
  );
};

export default AntSearchInput;

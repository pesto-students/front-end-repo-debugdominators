import React from "react";
import { Select } from "antd";
import { AntSelectItem } from "@/utils/types/html";

const onSearch = () => {};

const filterOption = (
  input: string,
  option?: { label: string; value: string },
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const AntSelect: React.FC<AntSelectItem> = ({
  options,
  placeholder,
  setTopic,
  value,
}) => {
  let finalVal = undefined;
  if (value?.trim()) finalVal = value;

  const handleChange = (value: string) => {
    setTopic(value);
  };
  return (
    <Select
      value={finalVal}
      showSearch
      placeholder={placeholder}
      optionFilterProp="children"
      onChange={handleChange}
      onSearch={onSearch}
      filterOption={filterOption}
      options={options}
    />
  );
};

export default AntSelect;

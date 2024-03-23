import React from "react";
import { Input, Tooltip } from "antd";
import { NumberInputProps } from "@/utils/types/state";

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

const NumericInput = (props: NumberInputProps) => {
  const { title, maxLength = 61, placeholder, value, onChange } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      if (Number(inputValue) < maxLength) onChange!(Number(inputValue));
    }
  };

  const handleBlur = () => {
    const strValue = `${value}`;
    let valueTemp = `${value}`;
    if (strValue.charAt(strValue.length - 1) === "." || strValue === "-") {
      valueTemp = strValue.slice(0, -1);
    }
    onChange!(Number(valueTemp.replace(/0*(\d+)/, "$1")));
  };

  const titleValue = value ? (
    <span className="numeric-input-title">
      {`${value}` !== "-" ? formatNumber(Number(value)) : "-"}
    </span>
  ) : (
    title
  );

  return (
    <Tooltip
      trigger={["focus"]}
      title={titleValue}
      placement="topLeft"
      overlayClassName="numeric-input"
    >
      <Input
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </Tooltip>
  );
};

const NumberInput: React.FC<NumberInputProps> = ({
  title = "Min 1 minute Max 60 minute Default 5 minute",
  maxLength = 61,
  style = { width: 120 },
  placeholder = "Input a number",
  handleChange,
  value,
}) => {
  return (
    <NumericInput
      title={title}
      style={style}
      placeholder={placeholder}
      maxLength={maxLength}
      value={value}
      onChange={handleChange}
    />
  );
};

export default NumberInput;

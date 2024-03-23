import { MouseEventHandler } from "react";
import { ReactNode } from "react";

export interface AuthHeaderProps {
  header: string;
  subheader: ReactNode;
}

export interface InputPropsParent {
  mail: string;
  setMail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSubmit: MouseEventHandler<HTMLInputElement>;
}

export interface registerInputProps extends InputPropsParent {
  username: string;
  setUsername: (value: string) => void;
}

export interface InputPropsChild {
  placeholder: string;
  value?: string;
  setValue: (value: string) => void;
  type: string;
  name: string;
}

export interface ClickProps {
  handleSubmit: MouseEventHandler<HTMLInputElement>;
}

export interface AntSelectItem {
  options: {
    value: string;
    label: string;
  }[];
  placeholder: string;
  value?: string;
  setTopic: (value: string) => void;
}

import { ObjectId } from "mongodb";
import { Dispatch, ReactNode, SetStateAction } from "react";

export interface BlogItem {
  html: string | HTMLElement;
}

export interface TopicItem {
  _id: number | string;
  topic: string;
}

export interface SelectStateProps {
  value: string;
  label: string;
}

export interface TextAreaField {
  setHeading: (value: string) => void;
  placeholder: string;
}

export interface UplaodField {
  type: string[];
  maxCount: number;
  setImage: (value: string) => void;
}

export interface AntButtonProps {
  type?: "dashed" | "link" | "text" | "default" | "primary";
  name?: string;
  style?: {
    background?: string;
    color?: string;
  };
  handleSubmit: () => void;
}

export interface AntAlertProps {
  message: string;
  description: string;
  type: "error" | "success" | "info" | "warning";
  isShowIcon: boolean;
  handleClick: () => void;
}

export interface AntSearchInputProps {
  placeholder: string;
  buttonName: string;
  size: "large" | "middle" | "small";
  isLoading: boolean;
  allowClear: boolean;
  handleChange: (value: string) => void;
  handleClick: () => void;
  count?: boolean;
}

export interface NumberInputProps {
  title?: string;
  value?: number;
  style?: React.CSSProperties;
  onChange?: Dispatch<SetStateAction<number>>;
  handleChange?: Dispatch<SetStateAction<number>>;
  placeholder?: string;
  maxLength?: number;
}

export interface AntSpinProps {
  tip?: string;
  size?: "small" | "default" | "large";
}

interface author {
  _id: ObjectId;
  name: string;
  email: string;
  image?: string;
}

export interface BlogProps {
  author: author;
  bannerImg: string;
  content: string;
  createdAt: Date | string;
  heading: string;
  isPublished: boolean;
  readingTime: number;
  staffPick: boolean;
  topic: string;
  updatedAt: Date | string;
  _id: ObjectId | string;
}

export interface BlogContentProps {
  html?: HTMLElement | string;
  image?: string;
  url?: string;
  code?: unknown;
  video?: HTMLIFrameElement | string;
}

export interface DraggableModalProps {
  footer?: ReactNode[];
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
  component: ReactNode;
  title?: string;
  property?: string;
  handleSubmit: (name: string) => void;
}

export interface UserUpdateProps {
  _id?: string;
  image?: string;
  address?: string;
  name?: string;
  email?: string;
  bio?: string;
}

export interface HandlePaymentProps {
  currency: string;
  amount: number;
}

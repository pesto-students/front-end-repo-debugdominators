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
  value?: string;
  setHeading: (value: string) => void;
  placeholder: string;
}

export interface UplaodField {
  value?: string;
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
  message?: string;
  description?: string;
  type?: "error" | "success" | "info" | "warning";
  isShowIcon?: boolean;
  handleClick?: () => void;
}

export interface AntSearchInputProps {
  value?: string;
  placeholder: string;
  buttonName: string;
  size: "large" | "middle" | "small";
  isLoading: boolean;
  allowClear: boolean;
  isButton?: boolean;
  handleChange: (value: string) => void;
  handleClick?: () => void;
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

export interface Author {
  _id: ObjectId | string;
  name: string;
  email: string;
  image?: string;
}

export interface BlogContentProps {
  _id?: ObjectId;
  html?: HTMLElement | string;
  image?: string;
  url?: string;
  code?: unknown;
  video?: HTMLIFrameElement | string;
}

export interface BlogProps {
  author: Author;
  bannerImg: string;
  content: BlogContentProps[];
  likedUsers?: (ObjectId | string)[];
  savedUsers?: (ObjectId | string)[];
  createdAt: Date | string;
  heading: string;
  isPublished: boolean;
  readingTime: number;
  staffPick: boolean;
  topic: string;
  updatedAt: Date | string;
  _id: ObjectId | string;
}

export interface CommentProps {
  _id: ObjectId;
  author: Author;
  blog: ObjectId;
  content: string;
  date: Date;
}

export interface CommentsProps {
  comments?: CommentProps[];
  commentLoading?: boolean;
  remainComments?: number;
  userId?: ObjectId | string;
  handleDeleteComment?: (commentId: ObjectId) => void;
  loadMoreComments?: () => void;
}

export interface BlogDetailPorps extends CommentsProps {
  isCommentShow?: boolean;
  loading: boolean;
  editMeta?: boolean;
  deleteConetent?: boolean;
  blog: BlogProps;
  isAuthor?: boolean;
  comment?: string;
  alert?: AntAlertProps;
  isAlert?: boolean;
  isEditContent?: boolean;
  likingBlog?: () => void;
  savingBlog?: () => void;
  handleRedirect?: () => void;
  deletContent?: (id: ObjectId) => void;
  editContent?: (content: BlogContentProps) => void;
  handleShowComments?: () => void;
  setComment?: Dispatch<SetStateAction<string>>;
  handleSubmitComment?: () => void;
  pathToEdit?: () => void;
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

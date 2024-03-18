import { ObjectId } from "mongoose";

export interface BasicUserInfo {
  _id: unknown;
  name: string;
  email: string;
  image: string;
  bio: string;
  address: string;
  followers?: ObjectId[];
  following?: ObjectId[];
}

export interface User extends BasicUserInfo {
  password: string;
  emailVerified?: boolean;
  emailVerification?: {
    token: string;
    expiry: Date;
  };
}

export interface Blog {
  author: ObjectId;
  heading: string;
  createdAt: Date;
  updatedAt: Date;
  topic: string;
  bannerImg: string;
  content: [
    { html?: HTMLElement | string },
    { image?: string },
    { url?: string },
    { code?: unknown },
    { video?: HTMLIFrameElement },
  ];
  staffPick: boolean;
  isPublished: boolean;
  seen?: number;
  readingTime?: number;
  likes?: number;
  unlikes?: number;
  likedUsers?: ObjectId[];
  savedUsers?: ObjectId[];
}

export interface Topic {
  topic: string;
}

export interface Payment {
  sender: ObjectId;
  receiver: ObjectId;
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: string;
  createdAt: Date;
}

export interface Message {
  sender: string;
  receiver: string;
  content: string;
  date: Date;
  _id: string;
}

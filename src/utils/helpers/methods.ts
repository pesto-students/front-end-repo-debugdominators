import { Blog } from "@/utils/types/mongoose";
import { BlogContentProps } from "@/utils/types/state";

import {
  errorMessages,
  headers,
  server,
  success,
  successMessages,
} from "@/constants/http";
import { payment } from "@/constants/service";

interface HttpResponseParam {
  msg: string;
  data: unknown;
  status: number;
  success: boolean;
}
export const httpResponse = (payload: HttpResponseParam) => {
  const { msg, data, status, success } = payload;
  return new Response(
    JSON.stringify({
      msg,
      data,
      success,
    }),
    {
      headers: headers.JSON,
      status,
    },
  );
};

export const commonCatchError = (error: string) => {
  const payload = {
    msg: errorMessages.SERVICE_UNAVIL,
    data: error,
    status: server.SERVICE_UNAVIL,
    success: false,
  };
  return httpResponse(payload);
};

export const commonSuccessResponse = (data: unknown) => {
  const payload = {
    msg: successMessages.FETCHED_SUCCESS,
    data,
    status: success.OK,
    success: true,
  };
  return httpResponse(payload);
};

export const getFileTypeFomBase64 = (file: string) => {
  const words = file.split(":");
  const fileType = words[1].split(";");
  return fileType[0];
};

export const getFileExtFromType = (type: string) => {
  const ext = type.split("/");
  if (ext[1] === "svg+xml") return "svg";
  return ext[1];
};

export const generateBlogPayload = (response: Blog[]) => {
  const blogs = [];
  for (let i = 0; i < response?.length; i++) {
    const content: BlogContentProps[] = response[i]?.content;
    for (let j = 0; j < content?.length; j++) {
      const { html } = content[j];
      if (html) blogs.push({ ...response[i], content: html });
      break;
    }
  }
  return blogs;
};

export const findHowmanyDaysBefore = (date: Date | string) => {
  const givenDate: Date = new Date(date);
  const currentDate: Date = new Date();
  const differenceInMilliseconds: number =
    currentDate.getTime() - givenDate.getTime();
  const differenceInDays: number =
    differenceInMilliseconds / (1000 * 60 * 60 * 24);
  if (differenceInDays < 1) return "today";
  return `${Math.round(differenceInDays)} days ago`;
};

export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = payment.CHECKOUT;

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

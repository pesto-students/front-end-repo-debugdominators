import Razorpay from "razorpay";
import { RazorpayAPI } from "../types/service";

export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZOR_KEY_ID!,
  key_secret: process.env.RAZOR_KEY_SECRET!,
});

export const createOrder = async ({
  amount,
  currency = "INR",
}: RazorpayAPI) => {
  const options = {
    amount,
    currency,
    receipt: "receipt#1",
    notes: {
      key1: "sample value 1",
      key2: "sample value 2",
    },
  };
  try {
    return await razorpay.orders.create(options);
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};

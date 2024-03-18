import { client, server } from "@/constants/http";
import {
  commonCatchError,
  commonSuccessResponse,
  httpResponse,
} from "@/utils/helpers/methods";
import { createOrder } from "@/utils/services/payment";
import { NextRequest } from "next/server";
import crypto from "crypto";
import UserModel from "@/model/User";
import PaymentModel from "@/model/Payment";
import { sendEmail } from "@/utils/services/emailService";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { amount, currency = "INR", sender, receiver } = body;
  if (!amount) {
    const payload = {
      msg: "Please enter valid amount",
      data: body,
      status: client.BAD_REQ,
      success: false,
    };
    return httpResponse(payload);
  }
  try {
    let amt = 0;
    if (currency === "INR") amt = amount * 100;
    const response = await createOrder({ amount: amt, currency });
    if (!response) {
      const payload = {
        msg: `Razorpay response not available`,
        data: body,
        status: server.SERVICE_UNAVIL,
        success: false,
      };
      return httpResponse(payload);
    }
    await PaymentModel.create({
      orderId: response?.id,
      amount: amt,
      sender,
      receiver,
      createdAt: response?.created_at,
      currency,
    });
    return commonSuccessResponse(response);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const {
    orderCreationId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    sender,
    receiver,
  } = body;
  if (
    !orderCreationId ||
    !razorpayPaymentId ||
    !razorpayOrderId ||
    !razorpaySignature
  ) {
    const payload = {
      msg: "Eitehr orderCreationId or razorpayPaymentId or razorpayOrderId or razorpaySignature is missing",
      data: body,
      status: client.BAD_REQ,
      success: false,
    };
    return httpResponse(payload);
  }
  try {
    const shasum = crypto.createHmac("sha256", process.env.RAZOR_KEY_SECRET!);
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest("hex");
    if (digest !== razorpaySignature) {
      const payload = {
        msg: "Signature is not verified",
        data: body,
        status: client.BAD_REQ,
        success: false,
      };
      return httpResponse(payload);
    }
    const senderDetails = await UserModel.findById(sender);
    const receiverDetails = await UserModel.findById(receiver);
    const payment = await PaymentModel.findOneAndUpdate(
      { orderId: orderCreationId },
      { paymentId: razorpayPaymentId },
      { new: true },
    );
    await sendEmail({
      email: senderDetails?.email,
      html: `<div>
      <h4>Hi ${senderDetails?.name}</h4>
      <br />
      <p>Your payment <strong style="background: yellow;"> ${payment?.currency} ${payment?.amount} </strong> sent to <strong style="background: yellow;"> ${receiverDetails?.name}</strong>, Your payment id is <strong style="background: yellow;">${payment?.paymentId}</strong>. </p>
      </div>`,
    });
    await sendEmail({
      email: receiverDetails?.email,
      html: `<div>
      <h4>Hi ${receiverDetails?.name}</h4>
      <br />
      <p>You got payment <strong style="background: yellow;"> ${payment?.currency} ${payment?.amount} </strong> from <strong style="background: yellow;"> ${senderDetails?.name} </strong>, Payment id is <strong style="background: yellow;"> ${payment?.paymentId} </strong>. </p>
      </div>`,
    });
    return commonSuccessResponse(body);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

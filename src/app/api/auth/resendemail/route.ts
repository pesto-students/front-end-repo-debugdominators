import UserModel from "@/model/User";
import { client, errorMessages, server, success } from "@/constants/http";
import { httpResponse } from "@/utils/helpers/methods";
import jwt from "jsonwebtoken";
import { authMail } from "@/utils/services/emailService";
import { getDateDifference, getNextDate } from "@/utils/helpers/getDate";
import { simple } from "@/constants/random";
import dbConnect from "@/utils/services/dbConnection";

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;
  const { DAY } = simple;
  try {
    await dbConnect();
    const user = await UserModel.findOne({ email });
    if (user) {
      const days: number = getDateDifference(
        user.emailVerification.expiry,
        DAY,
      );
      if (days >= 1) {
        const userData = {
          id: user._id,
          username: user.username,
          email: user.email,
        };
        const token: string = await jwt.sign(userData, process.env.JWT_SECRET);
        const expiryDate = getNextDate(1);
        await UserModel.updateOne(
          { _id: userData.id },
          {
            $set: {
              "emailVerification.token": token,
              "emailVerification.expiry": expiryDate,
            },
          },
        );
        const messageId = await authMail({ token, email });
        if (!messageId) {
          const payload = {
            msg: "Email sending Failed",
            data: email,
            status: server.SERVICE_UNAVIL,
            success: false,
          };
          return httpResponse(payload);
        }
        const payload = {
          msg: "Email sent successfully",
          data: email,
          status: success.OK,
          success: true,
        };
        return httpResponse(payload);
      }
      const payload = {
        msg: "Per Day One Email Only Allowed",
        data: email,
        status: server.SERVICE_UNAVIL,
        success: false,
      };
      return httpResponse(payload);
    }
    const payload = {
      msg: "User not found in DB",
      data: email,
      status: client.UN_AUTH,
      success: false,
    };
    return httpResponse(payload);
  } catch (error) {
    const payload = {
      msg: errorMessages.SERVICE_UNAVIL,
      data: JSON.stringify(error),
      status: server.SERVICE_UNAVIL,
      success: false,
    };
    return httpResponse(payload);
  }
}

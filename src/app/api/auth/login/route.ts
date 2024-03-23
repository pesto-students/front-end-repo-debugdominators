import bcrypt from "bcrypt";
import UserModel from "@/model/User";
import { client, errorMessages, server, success } from "@/constants/http";
import { loginSchema } from "@/utils/validation/user";
import { httpResponse } from "@/utils/helpers/methods";
import dbConnect from "@/utils/services/dbConnection";

export async function POST(req: Request) {
  const body = await req.json();
  const { error } = loginSchema.validate(body, {
    abortEarly: false,
  });
  if (error) {
    const payload = {
      msg: "Validation failed",
      data: error?.message,
      status: client.BAD_REQ,
      success: false,
    };
    return httpResponse(payload);
  }
  const { email, password } = body;
  try {
    await dbConnect();
    const userDetails = await UserModel.findOne({ email });
    if (!userDetails) {
      const payload = {
        msg: "Incorrect Email",
        data: email,
        status: client.UN_AUTH,
        success: false,
      };
      return httpResponse(payload);
    }
    const isAuth = await bcrypt.compare(password, userDetails.password);
    if (isAuth) {
      const userData = {
        id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
      };
      const payload = {
        msg: "Login Successfully",
        data: userData,
        status: success.OK,
        success: true,
      };
      return httpResponse(payload);
    }
    const payload = {
      msg: "Incorrect Password",
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

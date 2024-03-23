import UserModel from "@/model/User";
import { client, errorMessages, server, success } from "@/constants/http";
import { registerSchema } from "@/utils/validation/user";
import { httpResponse } from "@/utils/helpers/methods";
import dbConnect from "@/utils/services/dbConnection";

export async function POST(req: Request) {
  const body = await req.json();
  const { error } = registerSchema.validate(body, {
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
  const { name, email, password } = body;
  try {
    await dbConnect();
    const userData = await UserModel.findOne({ email });
    if (userData) {
      const payload = {
        msg: "Email already exist",
        data: userData.email,
        status: client.CONFLICT,
        success: false,
      };
      return httpResponse(payload);
    }
    const user = new UserModel({
      name,
      email,
      password,
    });
    const uploadData = await user.save();
    if (uploadData._id) {
      const payload = {
        msg: "User registered Successfully",
        data: uploadData._id,
        status: success.CREATED,
        success: true,
      };
      return httpResponse(payload);
    }
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

import dbConnect from "@/utils/services/dbConnection";
import UserModel from "@/model/User";
import { client, errorMessages, server, success } from "@/constants/http";
import { httpResponse } from "@/utils/helpers/methods";
import { userSelect } from "@/constants/service";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    await dbConnect();
    const userDetails = await UserModel.findById(session?.user?.id).select(
      userSelect,
    );
    if (!userDetails) {
      const payload = {
        msg: "Incorrect session or no session",
        data: session?.user?.id,
        status: client.UN_AUTH,
        success: false,
      };
      return httpResponse(payload);
    }

    const payload = {
      msg: "Success",
      data: userDetails,
      status: success.OK,
      success: true,
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

import dbConnect from "@/utils/services/dbConnection";
import UserModel from "@/model/User";
import { client, errorMessages, server, success } from "@/constants/http";
import { httpResponse } from "@/utils/helpers/methods";
import { NextRequest } from "next/server";
import { userSelect } from "@/constants/service";
import { isValidObjectId } from "mongoose";

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const path = pathname.split("/");
  const endPath = path[path?.length - 1]?.trim();
  if (!isValidObjectId(endPath) || !endPath) {
    const payload = {
      msg: "No id passed or object is not passed",
      data: endPath,
      status: client.UN_AUTH,
      success: false,
    };
    return httpResponse(payload);
  }
  try {
    await dbConnect();
    const userDetails = await UserModel.findById(endPath).select(userSelect);
    if (!userDetails) {
      const payload = {
        msg: "Incorrect user id passed",
        data: endPath,
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

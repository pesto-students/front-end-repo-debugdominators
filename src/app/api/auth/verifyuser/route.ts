import { client, success } from "@/constants/http";
import { extended } from "@/constants/random";
import UserModel from "@/model/User";
import { verifyToken } from "@/utils/helpers/getTokenData";
import { commonCatchError, httpResponse } from "@/utils/helpers/methods";
import dbConnect from "@/utils/services/dbConnection";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = cookies().get(process.env.COOKIE_TOKEN || "token")?.value;
    if (!token?.trim()) {
      const payload = {
        msg: extended.NO_TOKEN,
        data: "",
        status: client.UN_AUTH,
        success: false,
      };
      return httpResponse(payload);
    }
    const id = await verifyToken(token);
    if (id) {
      await dbConnect();
      const userDetails = UserModel.findById(id);
      if (userDetails && userDetails !== null) {
        const payload = {
          msg: extended.USER_VERIFIED,
          data: userDetails,
          status: success.OK,
          success: true,
        };
        return httpResponse(payload);
      }
      const payload = {
        msg: extended.NO_USER,
        data: id,
        status: client.UN_AUTH,
        success: false,
      };
      return httpResponse(payload);
    }
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

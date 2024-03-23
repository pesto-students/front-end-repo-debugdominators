import { client, success } from "@/constants/http";
import { extended } from "@/constants/random";
import { clientEndPointsAuth } from "@/constants/uri";
import { commonCatchError, httpResponse } from "@/utils/helpers/methods";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = cookies().get(process.env.COOKIE_TOKEN || "token")?.value;
    if (!token?.trim()) {
      const payload = {
        msg: extended.ALREADY_LOGOUT,
        data: "",
        status: client.TOO_MANY_REQ,
        success: false,
      };
      return httpResponse(payload);
    }
    const payload = {
      msg: extended.LOGOUT_SUCCESS,
      data: token,
      status: success.OK,
      success: true,
    };
    cookies().set(process.env.COOKIE_TOKEN || "token", "", {
      maxAge: 0,
      httpOnly: true,
    });
    NextResponse.redirect(new URL(clientEndPointsAuth.LOGIN, request.nextUrl));
    return httpResponse(payload);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

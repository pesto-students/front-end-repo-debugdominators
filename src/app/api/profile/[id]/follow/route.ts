import UserModel from "@/model/User";
import {
  commonCatchError,
  commonSuccessResponse,
} from "@/utils/helpers/methods";
import dbConnect from "@/utils/services/dbConnection";
import { sendEmail } from "@/utils/services/emailService";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.split("/");
  const endPath = path[path?.length - 2]?.trim();
  if (!endPath) throw new Error("No id is passed");
  const body = await request.json();
  const { isFollowed, follower, following } = body;
  try {
    await dbConnect();
    if (!isFollowed) {
      const followingUserData = await UserModel.findByIdAndUpdate(following, {
        $addToSet: { followers: follower },
      });
      const followerUserData = await UserModel.findByIdAndUpdate(follower, {
        $addToSet: { following: following },
      });
      await sendEmail({
        email: followingUserData?.email,
        html: `<div>
        <h4>Hi ${followingUserData?.name}</h4>
        <br />
        <p>${followerUserData?.name} started to following you. </p>
        </div>`,
      });
    } else {
      await UserModel.updateOne(
        {
          _id: following,
        },
        { $pull: { followers: follower } },
      );
      await UserModel.updateOne(
        {
          _id: follower,
        },
        { $pull: { following: following } },
      );
    }
    return commonSuccessResponse("Updated Successfully");
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

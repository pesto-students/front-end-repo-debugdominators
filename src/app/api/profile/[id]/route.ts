import { client, success } from "@/constants/http";
import { blogSelect, userSelect } from "@/constants/service";
import BlogModel from "@/model/Blog";
import UserModel from "@/model/User";
import {
  commonCatchError,
  commonSuccessResponse,
  generateBlogPayload,
  httpResponse,
} from "@/utils/helpers/methods";
import dbConnect from "@/utils/services/dbConnection";
import { imageUpload } from "@/utils/services/fileUploadinS3";
import { UserUpdateProps } from "@/utils/types/state";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const queryBlogs = request.nextUrl.searchParams.get("blogs");
  let page: string | null | number = request.nextUrl.searchParams.get("page");
  if (!page) page = 1;
  else page = parseInt(page);
  let per_page: string | null | number =
    request.nextUrl.searchParams.get("per_page");
  if (!per_page) per_page = 3;
  else per_page = parseInt(per_page);
  const path = pathname.split("/");
  const endPath = path[path?.length - 1]?.trim();
  if (!endPath) throw new Error("No id is passed");

  try {
    await dbConnect();
    let data = {};
    if (queryBlogs) {
      let skip = 0;
      if (page === 1) skip = 0;
      else if (page > 1) skip = (page - 1) * per_page;
      const total_count_liked = await BlogModel.countDocuments({
        likedUsers: endPath,
      });
      const remain_count_liked = total_count_liked - (skip + per_page);
      const total_count_saved = await BlogModel.countDocuments({
        savedUsers: endPath,
      });
      const remain_count_saved = total_count_saved - (skip + per_page);

      const likedUsersMongo = await BlogModel.find({ likedUsers: endPath })
        .select(blogSelect)
        .skip(skip)
        .limit(per_page);
      const savedUsersMongo = await BlogModel.find({ savedUsers: endPath })
        .select(blogSelect)
        .skip(skip)
        .limit(per_page);

      const likedUsers = generateBlogPayload(
        JSON.parse(JSON.stringify(likedUsersMongo)),
      );
      const savedUsers = generateBlogPayload(
        JSON.parse(JSON.stringify(savedUsersMongo)),
      );
      data = { likedUsers, savedUsers, remain_count_liked, remain_count_saved };
    } else {
      data = await UserModel.findById(endPath)
        .populate({
          path: "followers",
          select: "name email image bio",
        })
        .populate({
          path: "following",
          select: "name email image bio",
        })
        .select(userSelect);
    }

    if (!data) {
      const payload = {
        msg: "user not found",
        data: endPath,
        status: client.UN_AUTH,
        success: false,
      };
      return httpResponse(payload);
    }
    return commonSuccessResponse(data);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

export async function PUT(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.split("/");
  const endPath = path[path?.length - 1]?.trim();
  if (!endPath) throw new Error("No id is passed");
  const body = await request.json();
  const { name, email, bio, address, image } = body;
  try {
    await dbConnect();
    let s3URL: string | false = "";
    const mongoPayload: UserUpdateProps = {};
    if (image) s3URL = await imageUpload(image);
    if (s3URL) mongoPayload.image = s3URL;
    if (name) mongoPayload.name = name;
    if (email) mongoPayload.email = email;
    if (bio) mongoPayload.bio = bio;
    if (address) mongoPayload.address = address;

    const userData = await UserModel.findOneAndUpdate(
      { _id: endPath },
      mongoPayload,
      { upsert: true, new: true },
    ).select(userSelect);
    if (!userData) {
      const payload = {
        msg: "user not found",
        data: endPath,
        status: client.UN_AUTH,
        success: false,
      };
      return httpResponse(payload);
    }
    const payload = {
      msg: "Profile image update successfully",
      data: userData,
      status: success.CREATED,
      success: true,
    };
    return httpResponse(payload);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

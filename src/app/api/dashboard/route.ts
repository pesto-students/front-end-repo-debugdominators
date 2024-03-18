import BlogModel from "@/model/Blog";
import {
  commonCatchError,
  commonSuccessResponse,
  generateBlogPayload,
} from "@/utils/helpers/methods";
import dbConnect from "@/utils/services/dbConnection";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  let page: string | null | number = request.nextUrl.searchParams.get("page");
  if (!page) page = 1;
  else page = parseInt(page);
  let per_page: string | null | number =
    request.nextUrl.searchParams.get("per_page");
  if (!per_page) per_page = 10;
  else per_page = parseInt(per_page);
  const staff_pick = request.nextUrl.searchParams.get("staff_pick");

  try {
    await dbConnect();
    if (staff_pick) {
      const mongoResponse = await BlogModel.find({
        isPublished: true,
        staffPick: true,
        "content.html": { $exists: true },
      })
        .limit(5)
        .sort({ updatedAt: -1 });
      const response = JSON.parse(JSON.stringify(mongoResponse));
      const blogs = generateBlogPayload(response);
      return commonSuccessResponse(blogs);
    }
    let skip = 0;
    if (page === 1) skip = 0;
    else if (page > 1) skip = (page - 1) * per_page;
    const total_count = await BlogModel.countDocuments({
      isPublished: true,
      staffPick: false,
      "content.html": { $exists: true },
    });
    const remain_count = total_count - (skip + per_page);
    const mongoResponse = await BlogModel.find({
      isPublished: true,
      staffPick: false,
      "content.html": { $exists: true },
    })
      .populate({
        path: "author",
        select: "name email image",
      })
      .skip(skip)
      .limit(per_page)
      .sort({ updatedAt: -1 });
    const response = JSON.parse(JSON.stringify(mongoResponse));
    const blogs = generateBlogPayload(response);
    const payload = {
      page,
      per_page,
      remain_count,
      total_count,
      blogs,
    };
    return commonSuccessResponse(payload);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

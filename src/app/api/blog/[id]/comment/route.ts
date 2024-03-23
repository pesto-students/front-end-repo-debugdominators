import BlogCommentModel from "@/model/BlogComment";
import {
  commonCatchError,
  commonSuccessResponse,
} from "@/utils/helpers/methods";
import dbConnect from "@/utils/services/dbConnection";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let page: string | null | number = request.nextUrl.searchParams.get("page");
  if (!page) page = 1;
  else page = parseInt(page);
  let per_page: string | null | number =
    request.nextUrl.searchParams.get("per_page");
  if (!per_page) per_page = 3;
  else per_page = parseInt(per_page);
  const path = pathname.split("/");
  const endPath = path[path?.length - 2]?.trim();
  if (!endPath) throw new Error("No id is passed");

  try {
    await dbConnect();
    let response = null;
    let skip = 0;
    if (page === 1) skip = 0;
    else if (page > 1) skip = (page - 1) * per_page;
    const total_count = await BlogCommentModel.countDocuments({
      blog: endPath,
    });
    const remain_count =
      total_count > skip + per_page ? total_count - (skip + per_page) : 0;
    const comments = await BlogCommentModel.find({
      blog: endPath,
    })
      .populate({
        path: "author",
        select: "name email image",
      })
      .skip(skip)
      .limit(per_page);

    response = { comments, remain_count, total_count };
    //   } else {
    //     response = await BlogModel.findById(endPath).populate({
    //       path: "author",
    //       select: "name email image",
    //     });
    //   }
    return commonSuccessResponse(response);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const pathname = request.nextUrl.pathname;
  const path = pathname.split("/");
  const endPath = path[path?.length - 2]?.trim();
  const { author, content } = body;
  if (!endPath || !author) throw new Error("No id is passed");
  if (!content) throw new Error("No content is passed");

  try {
    await dbConnect();
    const response = await BlogCommentModel.create({
      author,
      blog: endPath,
      content,
      date: new Date(),
    });
    return commonSuccessResponse(response);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

export async function DELETE(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.split("/");
  const endPath = path[path?.length - 2]?.trim();
  const author = request.nextUrl.searchParams.get("author");
  const comment_id = request.nextUrl.searchParams.get("comment_id");
  if (!endPath || !author) throw new Error("No id is passed");
  try {
    await dbConnect();
    const response = await BlogCommentModel.deleteOne({
      _id: comment_id,
      blog: endPath,
      author,
    });
    return commonSuccessResponse(response);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

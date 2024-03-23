import { client, success } from "@/constants/http";
import { blogSelect } from "@/constants/service";
import BlogModel from "@/model/Blog";
import {
  commonCatchError,
  commonSuccessResponse,
  generateBlogPayload,
  httpResponse,
} from "@/utils/helpers/methods";
import dbConnect from "@/utils/services/dbConnection";
import { imageUpload } from "@/utils/services/fileUploadinS3";
import { updateBlogSchema } from "@/utils/validation/blog";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authorBlogs = request.nextUrl.searchParams.get("author");
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
    let response = null;
    if (authorBlogs) {
      let skip = 0;
      if (page === 1) skip = 0;
      else if (page > 1) skip = (page - 1) * per_page;
      const total_count = await BlogModel.countDocuments({
        author: endPath,
        isPublished: true,
      });
      const remain_count =
        total_count > skip + per_page ? total_count - (skip + per_page) : 0;

      const blogsFromMongo = await BlogModel.find({
        author: endPath,
        isPublished: true,
      })
        .select(blogSelect)
        .skip(skip)
        .limit(per_page);

      const blogs = generateBlogPayload(
        JSON.parse(JSON.stringify(blogsFromMongo)),
      );
      response = { blogs, remain_count, total_count };
    } else {
      response = await BlogModel.findById(endPath).populate({
        path: "author",
        select: "name email image",
      });
    }
    return commonSuccessResponse(response);
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
  const { author, ...content } = body;
  const { error } = updateBlogSchema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const payload = {
      msg: "Validation failed",
      data: { error: error?.message, content },
      status: client.BAD_REQ,
      success: false,
    };
    return httpResponse(payload);
  }
  //   let s3URL: string | boolean | undefined = "null";
  //   if(body?.bannerImg) {
  //     const base64 = body?.bannerImg.split('/');
  //     if(base64[0] === "data:image") {
  //       s3URL = await imageUpload(body?.bannerImg);
  //     } else {
  //       s3URL = body?.bannerImg;
  //     }
  //   }
  if (content?.bannerImg) {
    const isHttp = content?.bannerImg.slice(0, 4);
    if (isHttp !== "http") {
      const base64 = content?.bannerImg.split("/");
      if (base64[0] === "data:image") {
        content.bannerImg = await imageUpload(content?.bannerImg);
      }
    }
  }
  if (content?.heading?.trim()) content.heading = content?.heading?.trim();
  if (content?.topic?.trim()) content.topic = content?.topic?.trim();
  if (content?.image) {
    const base64 = content?.image.split("/");
    if (base64[0] === "data:image") {
      content.image = await imageUpload(content?.image);
    }
  } else if (content?.video) {
    const video = content?.video?.split(" ");
    if (video !== "<iframe") {
      content.video = `<iframe width="100%" height="315" src=${content?.video} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    } else {
      content.video = content.video.replace(/width="\d*"/, 'width="100%"');
    }
  } else if (content?.url) {
    const link = content?.url?.split(":");
    if (link[0] !== "https") throw new Error("Please use https links");
  }

  try {
    await dbConnect();
    const response = await BlogModel.findOneAndUpdate(
      { _id: endPath, author },
      { $push: { content } },
      { new: true },
    );
    const payload = {
      msg: "Data saved successfully",
      data: response,
      status: success.CREATED,
      success: true,
    };
    return httpResponse(payload);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const pathname = request.nextUrl.pathname;
  const path = pathname.split("/");
  const endPath = path[path?.length - 1]?.trim();
  if (!endPath || !body?.author) throw new Error("No id is passed");

  try {
    await dbConnect();
    const response = await BlogModel.updateOne(
      { _id: endPath, author: body?.author },
      { readingTime: body?.readingTime || 5, isPublished: true },
    );
    return commonSuccessResponse(response);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

export async function PATCH(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.split("/");
  const endPath = path[path?.length - 1]?.trim();
  if (!endPath) throw new Error("No id is passed");

  const body = await request.json();
  const { author, contentId } = body;
  try {
    await dbConnect();
    const response = await BlogModel.findOneAndUpdate(
      { _id: endPath, author },
      { $pull: { content: { _id: contentId } } },
      { new: true },
    );
    const payload = {
      msg: "Content Data delted successfully",
      data: response,
      status: success.CREATED,
      success: true,
    };
    return httpResponse(payload);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

export async function DELETE(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.split("/");
  const endPath = path[path?.length - 1]?.trim();
  const authorId = request.nextUrl.searchParams.get("author");
  if (!endPath || !authorId) throw new Error("No id is passed");
  try {
    await dbConnect();
    const response = await BlogModel.deleteOne({
      _id: endPath,
      author: authorId,
    });
    const payload = {
      msg: "Data saved successfully",
      data: response,
      status: success.OK,
      success: true,
    };
    return httpResponse(payload);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

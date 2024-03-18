import { client, success } from "@/constants/http";
import BlogModel from "@/model/Blog";
import { commonCatchError, httpResponse } from "@/utils/helpers/methods";
import dbConnect from "@/utils/services/dbConnection";
import { imageUpload } from "@/utils/services/fileUploadinS3";
import { blogSchema } from "@/utils/validation/blog";

export async function POST(req: Request) {
  const body = await req.json();
  const { error } = blogSchema.validate(body, {
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
  try {
    let s3URL: string | boolean | undefined = "null";
    const base64 = body?.bannerImg.split("/");
    if (base64[0] === "data:image") {
      s3URL = await imageUpload(body?.bannerImg);
    } else {
      s3URL = body?.bannerImg;
    }
    await dbConnect();
    const response = await BlogModel.create({
      ...body,
      bannerImg: s3URL,
      createdAt: new Date(),
    });
    const payload = {
      msg: "New blog created successfully",
      data: response,
      status: success.CREATED,
      success: false,
    };
    return httpResponse(payload);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

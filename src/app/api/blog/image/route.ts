import { client, server, success } from "@/constants/http";
import { commonCatchError, httpResponse } from "@/utils/helpers/methods";
import { getImageFromUnsplash } from "@/utils/services/getImages";
import { UnsplashResponse } from "@/utils/types/service";
import { NextRequest } from "next/server";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 60 });
const successResponse = (data: UnsplashResponse) => {
  const payload = {
    msg: "Images fetched Successfully",
    data,
    status: success.OK,
    success: true,
  };
  return httpResponse(payload);
};
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const { search, page, per_page } = Object.fromEntries(searchParams.entries());
  if (
    !search ||
    !page ||
    !per_page ||
    typeof parseInt(page) !== "number" ||
    typeof parseInt(per_page) !== "number"
  ) {
    const payload = {
      msg: "Either missed search, page, per_page from query or page, per_page not passing as number",
      data: Object.fromEntries(searchParams.entries()),
      status: client.BAD_REQ,
      success: false,
    };
    return httpResponse(payload);
  }
  const key = `${search}${page}${per_page}`;
  const cachedResponse: UnsplashResponse | undefined = cache.get(key);
  if (cachedResponse) return successResponse(cachedResponse);
  try {
    const response = await getImageFromUnsplash({
      search,
      page: parseInt(page),
      per_page: parseInt(per_page),
    });
    if (response?.imgLinks.length === 0) {
      const payload = {
        msg: `No images got with the search ${search} in the ${page}th page and per page number is ${per_page}`,
        data: { search, page, per_page },
        status: server.SERVICE_UNAVIL,
        success: false,
      };
      return httpResponse(payload);
    }
    cache.set(key, response);
    return successResponse(response);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

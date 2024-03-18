import { client, server, success } from "@/constants/http";
import { commonCatchError, httpResponse } from "@/utils/helpers/methods";
import { askToAI } from "@/utils/services/openAI";
import { NextRequest } from "next/server";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 60 });
const successResponse = (data: string) => {
  const payload = {
    msg: "AI generate text Successfully",
    data,
    status: success.OK,
    success: true,
  };
  return httpResponse(payload);
};
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { question } = body;
  const trimmedQuestion = question.trim();
  if (!trimmedQuestion || typeof trimmedQuestion !== "string") {
    const payload = {
      msg: "There is no question or format is not string",
      data: body,
      status: client.BAD_REQ,
      success: false,
    };
    return httpResponse(payload);
  }
  const key = question;
  const cachedResponse: string | undefined = cache.get(key);
  if (cachedResponse) return successResponse(cachedResponse);
  try {
    const response = await askToAI(question);
    if (!response) {
      const payload = {
        msg: `Open AI response not available`,
        data: question,
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

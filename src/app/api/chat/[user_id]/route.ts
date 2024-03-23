import { pusherServer } from "@/lib/pusher";
import MessageModel from "@/model/Message";
import {
  commonCatchError,
  commonSuccessResponse,
} from "@/utils/helpers/methods";
import dbConnect from "@/utils/services/dbConnection";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.split("/");
  const endPath = path[path?.length - 1]?.trim();
  if (!endPath) throw new Error("No id is passed");
  const queryId = request.nextUrl.searchParams.get("user_id");
  try {
    await dbConnect();
    const messages = await MessageModel.find({
      $or: [
        { sender: endPath, receiver: queryId },
        { sender: queryId, receiver: endPath },
      ],
    });
    return commonSuccessResponse(messages);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

export async function POST(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.split("/");
  const endPath = path[path?.length - 1]?.trim();
  if (!endPath) throw new Error("No id is passed");
  const queryId = request.nextUrl.searchParams.get("user_id");
  const body = await request.json();
  const { message } = body;
  if (!message) throw new Error("No message is passed");
  try {
    await dbConnect();
    const payload = {
      sender: endPath,
      receiver: queryId,
      content: message,
      date: new Date(),
    };
    const response = await MessageModel.create(payload);
    await pusherServer.trigger("chat", "chat-event", response);
    return commonSuccessResponse(response);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

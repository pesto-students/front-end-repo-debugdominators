import TopicsModel from "@/model/Topic";
import {
  commonCatchError,
  commonSuccessResponse,
} from "@/utils/helpers/methods";
import dbConnect from "@/utils/services/dbConnection";

export async function GET() {
  try {
    await dbConnect();
    const data = await TopicsModel.find({});
    return commonSuccessResponse(data);
  } catch (error) {
    return commonCatchError(JSON.stringify(error));
  }
}

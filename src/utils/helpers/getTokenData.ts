import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    return decodedToken.id;
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};

export const verifyToken = async (token: string) => {
  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET!);
    return decodedToken;
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};

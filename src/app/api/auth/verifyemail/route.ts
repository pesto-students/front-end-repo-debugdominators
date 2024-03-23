// import { clientEndPoints, clientEndPointsAuth } from "@/constants/uri";
// import { verifyToken } from "@/utils/helpers/getTokenData";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { cookies } from "next/headers";
// import UserModel from "@/model/User";
// import { getDateDifference } from "@/utils/helpers/getDate";
// import { simple } from "@/constants/random";
// import dbConnect from "@/utils/services/dbConnection";

// export async function GET(req: NextRequest) {
//   const { LOGIN } = clientEndPointsAuth;
//   const { DASHBOARD } = clientEndPoints;
//   const { TOKEN, DAY } = simple;
//   const token = req.nextUrl.searchParams.get(TOKEN);
//   if (token) {
//     const id = await verifyToken(token);
//     if (id) {
//       try {
//         await dbConnect();
//         const user = await UserModel.findById(id);
//         if (user._id) {
//           const days: number = getDateDifference(
//             user.emailVerification.expiry,
//             DAY,
//           );
//           if (days <= 1) {
//             if (user.emailVerification.token === token) {
//               await UserModel.updateOne({ _id: id }, { isEmailVerified: true });
//               cookies().set(process.env.COOKIE_TOKEN!, token, {
//                 maxAge: 60 * 60 * 24 * 30,
//                 httpOnly: true,
//               });
//               return NextResponse.redirect(new URL(DASHBOARD, req.nextUrl));
//             }
//           }
//         }
//       } catch (error) {
//         return NextResponse.redirect(new URL(LOGIN, req.nextUrl));
//       }
//     }
//   }
//   return NextResponse.redirect(new URL(LOGIN, req.nextUrl));
// }

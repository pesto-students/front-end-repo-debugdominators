import PusherServer from "pusher";
import PusherClient from "pusher-js";

const { PUSHER_APP_ID, PUSHER_SECRET, NEXT_PUBLIC_CLUSTER } = process.env;
export const pusherServer = new PusherServer({
  appId: PUSHER_APP_ID!,
  key: "7f0e654af905c8fb4181",
  secret: PUSHER_SECRET!,
  cluster: NEXT_PUBLIC_CLUSTER!,
  useTLS: true,
});

export const pusherClient = new PusherClient("7f0e654af905c8fb4181", {
  cluster: "ap2",
});

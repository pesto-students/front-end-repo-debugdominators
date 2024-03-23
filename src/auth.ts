import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongoClientPromise from "./utils/services/mongoClientPromise";
import EmailProvider from "next-auth/providers/nodemailer";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const {
  AZURE_AD_CLIENT_ID,
  AZURE_AD_CLIENT_SECRET,
  AZURE_AD_TENANT_ID,
  SENDER_EMAIL,
  GMAIL_APP_PASSWORD,
  HOST,
  SERVICE,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  DB_NAME,
} = process.env;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    AzureADProvider({
      clientId: AZURE_AD_CLIENT_ID,
      clientSecret: AZURE_AD_CLIENT_SECRET,
      tenantId: AZURE_AD_TENANT_ID,
    }),
    EmailProvider({
      server: {
        host: HOST,
        service: SERVICE,
        auth: {
          user: SENDER_EMAIL,
          pass: GMAIL_APP_PASSWORD,
        },
      },
      from: SENDER_EMAIL,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        const { email, password } = credentials;
        const authResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_PATH_SERVER}/auth/login`,
          { email, password },
        );
        if (!authResponse?.data?.success) {
          return null;
        }
        return authResponse?.data?.data;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.email = user?.email;
        token.username = user?.name;
        token.id = user?.id;
      }
      return token;
    },
    session: ({ session, token }: any) => {
      if (token) {
        session.user.email = token?.email;
        session.user.username = token.username;
        session.user.id = token.id;
      }
      return session;
    },
  },
  adapter: MongoDBAdapter(mongoClientPromise, { databaseName: DB_NAME }),
  pages: {
    signIn: "/auth",
  },
});

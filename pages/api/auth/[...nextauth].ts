import NextAuth, { NextAuthOptions } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import AppleProvider from "next-auth/providers/apple";
import { BasicResultVo } from "@/types/backendInterface";
import { appFetch } from "@/common/appNetwork";
import { respStatusEnum } from "@/common/respStatusEnum";

type loginResponse = {
  access_token: string;
  username: string;
};
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credential",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials as any;
        try {
          const responseRaw = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              method: "POST",
              body: JSON.stringify({ username, password }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const response: BasicResultVo<loginResponse> =
            await responseRaw.json();
          console.log(response);
          if (response.status != respStatusEnum.SUCCESS) {
            throw new Error(response.msg);
          }
          return {
            id: username,
            access_token: response.data.access_token,
          };
        } catch (err: any) {
          console.log(err.message);
          return null;
        }
      },
    }),
    CredentialsProvider({
      name: "AuthCallback",
      id: "AuthCallback",
      credentials: {
        token: {
          label: "AccessToken",
          type: "text",
        },
      },
      async authorize(credentials, req) {
        console.log("start autorize!!!!");

        const { token } = credentials as NonNullable<typeof credentials>;
        console.log(token);
        try {
          const response = await appFetch<string>("/api/authcheck", token);
          console.log(response);
          if (response?.status != respStatusEnum.SUCCESS) {
            throw Error("authentication error, please try again");
          }
          return {
            id: response.data,
            access_token: token,
          };
        } catch (e: any) {
          console.log(e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, user, token }) {
      session.access_token = token?.access_token;
      console.log("sesionsssssssssssssssssss");
      return session;
    },
    async jwt({ token, user, account, profile }) {
      console.log("jwttttttttttttttttttt");
      if (user) {
        token.access_token = user.access_token;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);

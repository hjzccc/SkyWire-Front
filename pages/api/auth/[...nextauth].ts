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
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
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
        console.log("credentials", credentials);
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
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 5,
  },
  callbacks: {
    async session({ session, user, token }) {
      session.access_token = token?.access_token;
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.access_token = user.access_token;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);

import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginFormSchema } from "./validations/auth";
import { hashPassword } from "./utils";
import prisma from "./db";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authOptions: NextAuthConfig = {
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const result = loginFormSchema.safeParse(credentials);

        if (!result.success) return null;
        const { email, password } = result.data;

        const hashedPassword = await hashPassword(password);

        const _user = await prisma.user.findUnique({
          where: { email, password: hashedPassword },
        });

        if (!_user) return null;

        const { password: pwd, updatedAt, createdAt, ...user } = _user;
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }

      return token;
    },
    async session({ session, token }) {
      const { exp, iat, jti, sub, picture, ...restToken } = token;

      return {
        ...session,
        user: {
          ...session.user,
          ...restToken,
        },
      };
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

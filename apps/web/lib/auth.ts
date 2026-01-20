import { prisma } from "@tuvi/db";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.adminUser.findUnique({ where: { email: credentials.email } });
        if (!user) {
          return null;
        }

        const isValid = bcrypt.compareSync(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        } as { id: string; email: string; name: string; role: string };
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  }
};

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { User } from "next-auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/dashboard")) {
        return url;
      }
      return baseUrl;
    },
    async session({ session, token }) {
      if (!token || !session.user) {
        return session;
      }

      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.accessToken = token.accessToken as string;

      // Check if user exists in database
      try {
        const user = await db.query.users.findFirst({
          where: eq(users.id, session.user.id),
        });

        // If user doesn't exist, return the session without modifications
        if (!user) {
          console.log(
            `User ${session.user.id} not found in database during session creation`,
          );
          return session;
        }

        // Update session with latest user data
        session.user.role = user.role;
        return session;
      } catch (error) {
        console.error("Error checking user existence in database:", error);
        return session;
      }
    },
    async jwt({ token, user }) {
      if (user && "id" in user && "role" in user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        // Add schema validation
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        try {
          // Find user by email
          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(password, user.password);

          if (!isValidPassword) {
            return null;
          }

          // Return user without password
          return {
            id: user.id,
            name: user.name || "",
            email: user.email,
            role: user.role,
            // Generate an access token or remove if not needed
            accessToken: `token_${user.id}`, // Simple token generation, replace with actual token if needed
          };
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
};

import NextAuth from "next-auth";
import { authConfig } from "@/features/auth/config/auth.config";

export const { auth, signIn, signOut } = NextAuth(authConfig);

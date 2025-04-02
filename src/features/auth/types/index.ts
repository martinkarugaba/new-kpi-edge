import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
};

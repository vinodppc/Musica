import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ARTIST" | "PRODUCER";
    } & DefaultSession["user"];
  }

  interface User {
    role: "ARTIST" | "PRODUCER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ARTIST" | "PRODUCER";
  }
}

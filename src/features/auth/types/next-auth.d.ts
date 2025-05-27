import type { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    role: string;
    accessToken?: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    accessToken?: string;
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser extends DefaultUser {
    id: string;
    role: string;
  }
}

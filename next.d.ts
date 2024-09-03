// next.d.ts
import { NextApiRequest } from 'next';

// Extend NextApiRequest with the custom `user` property
declare module 'next' {
  interface NextApiRequest {
    user?: {
      id: string;
      role: 'admin' | 'team_member';
    };
  }
}

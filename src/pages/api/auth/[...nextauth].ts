import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const nextAuthOptions = (req: any, res: any) => {
  console.log('req', req);
  console.log('res', res);
  console.log('process.env.GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID);
  console.log(
    'process.env.GOOGLE_CLIENT_SECRET',
    process.env.GOOGLE_CLIENT_SECRET,
  );
  return {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
  };
};

const authHandler = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};

export default authHandler;

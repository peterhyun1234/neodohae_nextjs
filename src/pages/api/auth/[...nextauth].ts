import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';
import GitHubProvider from 'next-auth/providers/github';
import axios from 'axios';
import jwt from 'jsonwebtoken';

axios.defaults.baseURL = process.env.API_SERVER_URI;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const generateToken = (user: string | object | Buffer) => {
  return jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: '60d',
  });
};

const nextAuthOptions: any = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.SSO_GITHUB_CLIENT_ID!,
      clientSecret: process.env.SSO_GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt({ token, account }: any) {
      try {
        if (account) {
          const currentUser = {
            username: token.name,
            email: token.email,
            picture: token.picture ?? null,
          };
          const generatedToken = generateToken(currentUser);
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${generatedToken}`;

          let res = await axios.get(`/users/email/${currentUser.email}`);
          if (!res.data) {
            res = await axios.post(`/users`, currentUser);
          }
          if (res.data.username) {
            token.user = res.data;
          }
          token.accessToken = generatedToken;
        }
        return token;
      } catch (error) {
        console.error('Signin error: ', error);
        return token;
      }
    },
    async session({ session, token, user }: any) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
};

const authHandler = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, nextAuthOptions);
};

export default authHandler;

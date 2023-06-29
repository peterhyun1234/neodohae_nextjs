import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';
import GitHubProvider from 'next-auth/providers/github';
import axios from 'axios';
import jwt from 'jsonwebtoken';

axios.defaults.baseURL = process.env.API_SERVER_URI!;
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
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async jwt({ token, trigger, session, account }: any) {
      if (trigger === 'signIn') {
        try {
          if (account) {
            const userForToken = {
              username: token.name,
              provider: account.provider ?? 'unknown',
              email: token.email,
            };
            const generatedToken = generateToken(userForToken);
            axios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${generatedToken}`;

            let res = await axios.get(
              `/users/email/${userForToken.email}/provider/${userForToken.provider}`,
            );

            let currentUser = res.data
            if (!currentUser) {
              res = await axios.post(`/users`, userForToken);
              if (res.data.username) {
                currentUser = res.data;
              }
            } else {
              if (currentUser.roomId) {
                res = await axios.get(`/rooms/id/${currentUser.roomId}`);
                const currentRoom = res.data;
                currentUser = {
                  ...currentUser,
                  roomName: currentRoom.roomName,
                  roomInviteCode: currentRoom.inviteCode,
                };
              }
            }
            if (currentUser) {
              token.user = currentUser;
            }
            token.accessToken = generatedToken;
          }
        } catch (error) {
          console.error('Signin error: ', error);
        }
      } else if (trigger === 'update') {
        token.user = session.user;
      } else if (trigger === 'signOut') {
        //TODO: signOut
        console.log('signOut');
      }
      return token;
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

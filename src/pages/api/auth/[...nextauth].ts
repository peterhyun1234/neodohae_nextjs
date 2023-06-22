// import NextAuth from 'next-auth'
// import Providers from 'next-auth/providers'

// export default NextAuth({
//   providers: [
//     Providers.Google({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET
//     }),
//     Providers.Kakao({
//       clientId: process.env.KAKAO_KEY,
//       clientSecret: process.env.KAKAO_SECRET
//     }),
//     Providers.Naver({
//       clientId: process.env.NAVER_ID,
//       clientSecret: process.env.NAVER_SECRET
//     }),
//   ],
//   database: process.env.DATABASE_URL,
//   session: {
//     jwt: true,
//   },
//   callbacks: {
//     async jwt(token, user) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//       }
//       return token;
//     },
//     async session(session, token) {
//       session.user.id = token.id;
//       session.user.email = token.email;
//       return session;
//     },
//   },
// })

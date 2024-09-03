import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          // setup which pemissions will be asked for
          // userinfo.email
          // userinfo.profile
          // calendar
          scope:
            'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar',
        },
      },
    }),
  ],

  // callbacks are strategic functions that will be called at specific moments
  callbacks: {
    async signIn({ account }) {
      // that function could return true or false, where true means ok, and false means not ok
      // the string`s return work as a false
      if (
        // if not has the calendar pemission, return an error
        !account?.scope?.includes('https://www.googleapis.com/auth/calendar')
      ) {
        return '/register/connect-calendar?error=permissions';
      }

      return true;
    },
  },
};
export default NextAuth(authOptions);

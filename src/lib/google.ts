import dayjs from "dayjs";
import { google } from "googleapis";
import { prisma } from "./prisma";

export async function getGoogleOAuthToken(userId: string) {
  // account recover
  const account = await prisma.account.findFirstOrThrow({
    where: {
      provider: "google",
      user_id: userId,
    },
  });

  // new oauth instance
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  // setup credentials with user data
  auth.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : null,
  });

  if (!account.expires_at) {
    return auth;
  }

  const isTokenExpired = dayjs(account.expires_at * 1000).isBefore(new Date());

  // doing token update
  // if token is expired, request another one
  if (isTokenExpired) {
    const { credentials } = await auth.refreshAccessToken();
    const {
      access_token,
      expiry_date,
      id_token,
      refresh_token,
      scope,
      token_type,
    } = credentials;

    // update db
    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        access_token,
        expires_at: expiry_date ? Math.floor(expiry_date / 1000) : null,
        id_token,
        refresh_token,
        scope,
        token_type,
      },
    });

    // setup credentials with user data
    auth.setCredentials({
      access_token,
      refresh_token,
      expiry_date,
    });
  }
  return auth;
}

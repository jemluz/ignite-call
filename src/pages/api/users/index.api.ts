import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { setCookie } from 'nookies';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // in next there is no distinction between HTTP methods.
  // need to treat that mannually
  if (req.method !== 'POST') {
    return res.status(405).end(); // end() send no body
  }

  const { name, username } = req.body;

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (userExists) {
    return res.status(400).json({
      message: 'Username already taken.',
    });
  }

  // data = what will be send
  // select = what will be return after the database does its database thing
  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  });

  // need res to set header (there is where goes the cookie)
  setCookie(
    { res },
    '@ignitecall:userId', // name of cookie
    user.id,
    {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    } // cookie config
  );

  return res.status(201).json(user);
}

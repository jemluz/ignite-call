import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  // in next there is no distinction between HTTP methods.
  // need to treat that mannually
  if (req.method !== 'POST') {
    return res.status(405).end() // end() send no body
  }

  const { name, username } = req.body

  const user = await prisma.user.create({
    // data = what will be send
    data: {
      name, username
    }
    // select = what will be return after the database does its database thing
  })

  return res.status(201).json(user)
}
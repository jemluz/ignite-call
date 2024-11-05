import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { buildNextAuthOptions } from '../auth/[...nextauth].api';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    })
  ),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  // try to catch the session from next-auth
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );

  // validate if has a session
  if (!session) {
    return res.status(401).end();
  }

  // zod`s parse is used to validate the data bafore extraction/desestricturing
  const { intervals } = timeIntervalsBodySchema.parse(req.body);

  // persist all/many registers once before return a response
  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id: session.user?.id,
        },
      });
    })
  );

  return res.json({ session });
}

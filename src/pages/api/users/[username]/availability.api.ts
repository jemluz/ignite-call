import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

/**
 * @route GET /api/users/[username]/availability
 * @description Returns available hours for a user on a specific date
 * @param {string} username - The username, passed as path param
 * @param {string} date - Date as `YYYY-MM-DD`, passed as query param
 *
 * @returns {object} 200 - Success:
 * - Returns an array of available time slots (`possibleTimes`) if the date is valid.
 * Example: If the user has availability from 10:00 AM to 12:00 PM, the response could be:
 *   ```json
 *   {
 *     "possibleTimes": [10, 11, 12]
 *   }
 *   ```
 * - Returns an empty array (`availability: []`) if the date is in the past.
 * - Returns an empty array (`availability: []`) if the user has no availability for the specified day.
 *
 * @returns {405} - Method not allowed, if was not a GET method
 * @returns {400} - Failure due to missing or invalid data:
 * - "Date not provided." if the date is missing.
 * - "User does not exist." if the user cannot be found.
 *
 * @example
 * // Example request:
 * fetch('/api/users/jemluz/availability?date=2022-12-01')
 *   .then(response => response.json())
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const username = String(req.query.username);
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date no provided.' });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' });
  }

  const referenceDate = dayjs(String(date));
  const isPastDate = referenceDate.endOf('day').isBefore(new Date());

  // If the date has already passed, availability`s array will be empty
  if (isPastDate) {
    return res.json({ availability: [] });
  }

  // find time intervals corresponding with the specific date
  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  });

  // if the user has no availability for the specified day, availability`s array will be empty
  if (!userAvailability) {
    return res.json({ availability: [] });
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability;

  const startHour = time_start_in_minutes / 60;
  const endHour = time_end_in_minutes / 60;

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i;
    }
  );

  // return as array like [10, 11, 12]
  return res.json({ possibleTimes });
}

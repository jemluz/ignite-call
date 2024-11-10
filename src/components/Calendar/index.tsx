import dayjs from 'dayjs';
import { CaretLeft, CaretRight } from 'phosphor-react';
import { useMemo, useState } from 'react';
import { getWeekDays } from '../../utils/get-week-days';
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelected: (date: Date) => void;
}

interface CalendarWeek {
  weekNumber: number;
  days: Array<{
    date: dayjs.Dayjs;
    disabled: boolean;
  }>;
}

type CalendarWeeks = CalendarWeek[];

// when we treating with dates in js, its important to keep in mind:
// day == week day
// date == day number
export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const firstDate = dayjs().set('date', 1);
  // set wich day is today
  const [currentDate, setCurrentDate] = useState(() => {
    return firstDate;
  });

  // return as QUA QUI SEX
  const shortWeekDays = getWeekDays({ short: true });

  // return as "November 2024"
  const currentMonth = currentDate.format('MMMM');
  const currentYear = currentDate.format('YYYY');

  // previous month nav
  function handlePreviousMonth() {
    const previousMonth = currentDate.subtract(1, 'month');
    setCurrentDate(previousMonth);
  }

  // next month nav
  function handleNextMonth() {
    const nextMonth = currentDate.add(1, 'month');
    setCurrentDate(nextMonth);
  }

  // return final array that will fill all the calendar days slots
  const calendarWeeks = useMemo(() => {
    // get days of current month
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, index) => {
      return currentDate.set('date', index + 1); // ignore 0 index
    });

    // wich weekday is, as a namber (basis on 1 for SUN and 7 for SAT)
    const firstWeekDay = currentDate.get('day');

    // get the remaining days of previous month
    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, index) => {
        return currentDate.subtract(index + 1, 'day');
      })
      .reverse();

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth()
    );

    // wich weekday is, as a namber (basis on 1 for SUN and 7 for SAT)
    const lastWeekDay = lastDayInCurrentMonth.get('day');

    // get the remaining days of next month
    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, 'day');
    });

    // return previous month + current month + next month
    // add a disabled status in all the next and previous month days
    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true };
      }),
      ...daysInMonthArray.map((date) => {
        return { date, disabled: date.endOf('day').isBefore(new Date()) };
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true };
      }),
    ];

    // reduce function structure (finalArray, element, index, originalArray).
    // reduce the calendarDays to an array with weeks arrays with days.
    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0;

        if (isNewWeek) {
          weeks.push({
            weekNumber: i / 7 + 1,
            days: original.slice(i, i + 7),
            // slice(init, end)
          });
        }
        return weeks;
      },
      []
    );

    // end of odisseia
    return calendarWeeks;
  }, [currentDate]);

  console.log(calendarWeeks);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth} title='Previous month'>
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title='Next month'>
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ weekNumber, days }) => {
            return (
              <tr key={weekNumber}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <CalendarDay
                        onClick={() => onDateSelected(date.toDate())}
                        disabled={disabled}
                      >
                        {date.get('date')}
                      </CalendarDay>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  );
}

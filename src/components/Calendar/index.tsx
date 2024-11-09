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

// when we treating with dates in js, its important to keep in mind:
// day == week day
// date == day number
export function Calendar() {
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

    // return previous month + current month
    return [...previousMonthFillArray, ...daysInMonthArray];
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
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay disabled>2</CalendarDay>
            </td>
            <td>
              <CalendarDay>3</CalendarDay>
            </td>
          </tr>
          <tr>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay disabled>2</CalendarDay>
            </td>
            <td>
              <CalendarDay>3</CalendarDay>
            </td>
          </tr>
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  );
}

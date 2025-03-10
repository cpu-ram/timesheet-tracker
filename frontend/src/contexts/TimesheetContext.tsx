import React, { createContext, useContext, useState, useEffect } from 'react';

import { Temporal } from '@js-temporal/polyfill';
import { startOfWeek } from '../utils/temporalFunctions.ts';

import fetchTimesheetData from '../utils/fetchTimesheetData.ts';
import updateWorkData from '../utils/updateWorkData.ts';

const today = Temporal.Now.plainDateISO();

function generateDateRange(numberOfWeeks = 2) {
  const firstWeekStart = startOfWeek(today).subtract({ days: 7 * (numberOfWeeks - 1) });
  const lastWeekEnd = firstWeekStart.add({ days: 7 * numberOfWeeks - 1 });

  return { from: firstWeekStart, to: lastWeekEnd };
}

function scaffoldWorkDataContainer(dateRange) {
  const days = [];
  let curr = dateRange.from;
  while (Temporal.PlainDate.compare(curr, dateRange.to) <= 0) {
    const day = curr;
    days.push({ date: day, workBlocks: [] });
    curr = curr.add({ days: 1 });
  }
  return days;
}

const TimesheetContext = createContext(null);

export function TimesheetProvider({ children }) {
  const [dateRange, setDateRange] = useState(() => generateDateRange());
  const [workData, setWorkData] = useState(() => scaffoldWorkDataContainer(dateRange));
  const [multiDaySelectionMode, setMultiDaySelectionMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [lastSelectedSingleDate, setLastSelectedSingleDate] = useState(Temporal.Now.plainDateISO());
  const [calendarMode, setCalendarMode] = useState(true);

  const fetchFullTimesheetData = async () => {
    const today = Temporal.Now.plainDateISO();
    const fetchedData = await fetchTimesheetData({ from: dateRange.from, to: today });

    updateWorkData(fetchedData, setWorkData);
  };

  const fetchDayTimesheetData = async (date) => {
    const fetchedData = await fetchTimesheetData({ from: date, to: date });
    updateWorkData(fetchedData, setWorkData);
  }

  function getRangeOfSelectedWeek() {
    const selectedWeekNumber = Math.floor((dateRange.from)
      .until(
        dateSelectionHandler.lastSelectedSingleDate,
        { largestUnit: 'days', smallestUnit: 'days', roundingMode: 'trunc' }
      ).days
      / 7);
    const selectedWeekStartPosition = selectedWeekNumber * 7;
    const startDay = dateRange.from.add({ days: selectedWeekStartPosition });
    const endDay = startDay.add({ days: 6 });

    return { from: startDay, to: endDay };
  }

  const workDataAggregator = {
    getWeekWorkHoursTotal: function () {
      const daysOfSelectedWeek = getDaysOfSelectedWeek();

      const nonRoundedTotal = daysOfSelectedWeek.map(
        (day) => {
          return this.getDayWorkHoursTotal(day);
        }).reduce((acc, curr) => acc + curr, 0);
      return Math.round(nonRoundedTotal * 10) / 10;
    },

    getDayWorkHoursTotal: function (day) {
      const workDay = workData.find((workDay) => (workDay.date).equals(day));
      if (!workDay) {
        throw new RangeError('Day not found');
      }
      const preciseTotal = workDay.workBlocks
        .map(workBlock => {
          if (workBlock.workBlockStart && workBlock.workBlockEnd) {
            return (workBlock.workBlockStart)
              .until(workBlock.workBlockEnd)
              .total({ unit: 'hour' });
          }
          return 0;
        })
        .reduce(
          (acc, curr) => acc + curr, 0);
      return Math.round(preciseTotal * 10) / 10;
    }
  }

  const dateSelectionHandler = {
    add: function (date) {
      setSelectedDates((prevSelectedDates) => [...prevSelectedDates, date]);
    },
    remove: function (date) {
      setSelectedDates((prevSelectedDates) => prevSelectedDates.filter((d) => !d.equals(date)));
    },
    selectSingleDay: async function (date) {
      setLastSelectedSingleDate(date);
      await fetchDayTimesheetData(lastSelectedSingleDate);
      setSelectedDates([date]);
      setEditMode(false);
      setAddMode(false);
    },
    lastSelectedSingleDate: lastSelectedSingleDate,
    isSelected: function (date) {
      return selectedDates.some((x) => (x.equals(date)));
    },
    multiSelectionOn: function () {
      setMultiDaySelectionMode(true);
    },
    multiSelectionOff: function () {
      setMultiDaySelectionMode(false);
      this.selectSingleDay(lastSelectedSingleDate);
    },
    switch: function () {
      if (multiDaySelectionMode) {
        this.multiSelectionOff();
      }
      else this.multiSelectionOn();
    },
    handleDateClick: function (date: Date) {
      if (!multiDaySelectionMode) {
        this.selectSingleDay(date);
      }
      else {
        switch (this.isSelected(date)) {
          case true:
            this.remove(date);
            break;
          case false:
            this.add(date);
            break;
          default:
            break;
        }
      }
    }
  }

  function getDaysOfSelectedWeek() {
    const selectedWeekNumber = Math.floor((dateRange.from)
      .until(
        dateSelectionHandler.lastSelectedSingleDate,
        {
          largestUnit: 'days', smallestUnit: 'days', roundingMode: 'trunc'
        }
      ).days / 7);

    const daysOfSelectedWeek = [];
    const selectedWeekStartPosition = selectedWeekNumber * 7;
    for (let i = 0; i <= 6; i++) {
      const day = dateRange.from.add({ days: selectedWeekStartPosition + i });
      daysOfSelectedWeek.push(day);
    }

    return daysOfSelectedWeek;
  }

  useEffect(() => {
    const newData = scaffoldWorkDataContainer(dateRange);
    setWorkData(newData);
  }, [dateRange]);

  useEffect(() => {
    dateSelectionHandler.selectSingleDay(today);
    const fetchFullData = async () => (await fetchFullTimesheetData());
    fetchFullData();
  }, []);


  return (
    <TimesheetContext.Provider value={{
      dateRange, setDateRange,
      workData, setWorkData,
      multiDaySelectionMode, setMultiDaySelectionMode,
      selectedDates, setSelectedDates,
      editMode, setEditMode,
      addMode, setAddMode,
      lastSelectedSingleDate, setLastSelectedSingleDate,
      dateSelectionHandler,
      calendarMode, setCalendarMode,
      getDaysOfSelectedWeek,
      workDataAggregator,
      getRangeOfSelectedWeek,
      fetchFullTimesheetData,
    }}>
      {children}
    </TimesheetContext.Provider>
  );
}

export function useTimesheetContext() {
  const context = useContext(TimesheetContext);
  if (!context) {
    throw new Error('useTimesheetContext must be used within a TimesheetProvider');
  }
  return context;
}
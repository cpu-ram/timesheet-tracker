/* eslint-disable no-unused-vars */
import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { Context } from 'react';

import { WorkBlockData } from '../types/WorkBlock.types.ts';
import { TimesheetDayRecord } from '../types/TimesheetDayRecord.ts';

import { Temporal } from '@js-temporal/polyfill';
import { startOfWeek } from '../utils/temporalFunctions.ts';

import fetchTimesheetData from '../api/fetchTimesheetData.ts';
import updateWorkData from '../utils/updateWorkData.ts';

import { addWorkBlock, updateWorkBlock, deleteWorkBlock } from '../api/workBlockApi.ts';

const today = Temporal.Now.plainDateISO();

function generateDateRange(numberOfWeeks: number = 2) {
  const firstWeekStart = startOfWeek(today).subtract({ days: 7 * (numberOfWeeks - 1) });
  const lastWeekEnd = firstWeekStart.add({ days: 7 * numberOfWeeks - 1 });

  return { from: firstWeekStart, to: lastWeekEnd };
}

function scaffoldWorkDataContainer(dateRange: {
  from: Temporal.PlainDate;
  to: Temporal.PlainDate;
}) {
  const days: TimesheetDayRecord[] = [];
  let curr = dateRange.from;
  while (Temporal.PlainDate.compare(curr, dateRange.to) <= 0) {
    const day = curr;
    days.push({ date: day, workBlocks: [] });
    curr = curr.add({ days: 1 });
  }
  return days;
}

const TimesheetContext: Context<any> = createContext(null);

export function TimesheetProvider({ children }: { children: React.ReactNode }) {
  const [dateRange, setDateRange] = useState(() => generateDateRange());
  const [workData, setWorkData] = useState(() => scaffoldWorkDataContainer(dateRange));
  const [multiDaySelectionMode, setMultiDaySelectionMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Temporal.PlainDate[]>([]);

  const [timesheetPageMode, setTimesheetPageMode] = useState<'view' | 'add' | 'edit'>('view');

  const [lastSelectedSingleDate, setLastSelectedSingleDate] = useState(Temporal.Now.plainDateISO());
  const [calendarMode, setCalendarMode] = useState(true);

  const [jobsiteSearchResults, setJobsiteSearchResults] = useState([]);
  const [selectedJobsiteData, setSelectedJobsiteData] = useState(null);
  const [suggestedJobsiteData, setSuggestedJobsiteData] = useState<any | null>(null);

  const fetchFullTimesheetData = async () => {
    const today = Temporal.Now.plainDateISO();
    const fetchedData = await fetchTimesheetData({ from: dateRange.from, to: today });

    updateWorkData(fetchedData, setWorkData);
  };

  const fetchMultipleDaysTimesheetData = async (dates: Temporal.PlainDate[]) => {
    let combinedData: TimesheetDayRecord[] = [];
    try {
      for (const date of dates) {
        const fetchedData = await fetchTimesheetData({ from: date, to: date });
        combinedData = combinedData.concat(fetchedData);
      }
    } catch (error) {
      console.log(error);
    }
    updateWorkData(combinedData, setWorkData);
  };

  const fetchDayTimesheetData = async (date: Temporal.PlainDate) => {
    const fetchedData = await fetchTimesheetData({ from: date, to: date });
    updateWorkData(fetchedData, setWorkData);
  };

  const handleSearchJobsites = async (value: string) => {
    const query = value;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    if (query.trim() === '') {
      setJobsiteSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/jobsites?query=${query}`, {
        method: 'GET',
        credentials: 'include',
      });
      const responseData = await response.json();
      setJobsiteSearchResults(responseData || []);
    } catch (error) {
      console.error('Error fetching job sites:', error);
      setJobsiteSearchResults([]);
    }
  };

  const handleAddWorkBlock = async ({
    workBlockData,
    onJobsiteCreated,
  }: {
    workBlockData: WorkBlockData;
    onJobsiteCreated?: (jobsiteId: string) => void;
  }) => {
    if (!selectedDates || selectedDates.length === 0) {
      throw new Error('No dates selected');
    }

    const workBlockCreationResult = await addWorkBlock(workBlockData, selectedDates);

    if (
      workBlockCreationResult.newJobsiteCreated &&
      workBlockCreationResult.jobsiteId &&
      onJobsiteCreated
    ) {
      onJobsiteCreated(workBlockCreationResult.jobsiteId);
    }

    await fetchMultipleDaysTimesheetData(selectedDates);
    await dateSelectionHandler.multiSelectionOff();
    setTimesheetPageMode('view');

  };

  const handleEditWorkBlock = async ({
    workBlockId,
    workBlockData,
    onError,
    onJobsiteCreated,
  }: {
    workBlockId: number;
    workBlockData: WorkBlockData;
    onError?: (error: Error) => void;
    onJobsiteCreated?: (jobsiteId: string) => void;
  }) => {
    try {
      const editResult = await updateWorkBlock({
        workBlockId,
        workBlockData,
        date: lastSelectedSingleDate,
      });

      if (!!onJobsiteCreated && editResult.newJobsiteCreated && editResult.jobsiteId) {
        onJobsiteCreated(editResult.jobsiteId);
      }
      await fetchDayTimesheetData(lastSelectedSingleDate);
    } catch (error: unknown) {
      console.error(error);
      if (onError && error instanceof Error) onError(error);
    }
  };

  const handleDeleteWorkBlock = async (workBlockId: number) => {
    await deleteWorkBlock(workBlockId);
    await fetchDayTimesheetData(lastSelectedSingleDate);
  };

  const handleDiscard = async function () {
    if (multiDaySelectionMode) await dateSelectionHandler.multiSelectionOff();

    setTimesheetPageMode('view');
  };

  function getRangeOfSelectedWeek() {
    const selectedWeekNumber = Math.floor(
      dateRange.from.until(dateSelectionHandler.lastSelectedSingleDate, {
        largestUnit: 'days',
        smallestUnit: 'days',
        roundingMode: 'trunc',
      }).days / 7,
    );
    const selectedWeekStartPosition = selectedWeekNumber * 7;
    const startDay = dateRange.from.add({ days: selectedWeekStartPosition });
    const endDay = startDay.add({ days: 6 });

    return { from: startDay, to: endDay };
  }

  const workDataAggregator = {
    getWeekWorkHoursTotal: function () {
      const daysOfSelectedWeek = getDaysOfSelectedWeek();

      const nonRoundedTotal = daysOfSelectedWeek
        .map(day => {
          return this.getDayWorkHoursTotal(day);
        })
        .reduce((acc, curr) => acc + curr, 0);
      return Math.round(nonRoundedTotal * 10) / 10;
    },

    getDayWorkHoursTotal: function (day: Temporal.PlainDate) {
      const workDay: TimesheetDayRecord | undefined = workData.find(workDay =>
        workDay.date.equals(day),
      );
      if (!workDay) {
        throw new RangeError('Day not found');
      }
      const preciseTotal = workDay.workBlocks
        .map(workBlock => {
          if (workBlock.workBlockStart && workBlock.workBlockEnd) {
            return workBlock.workBlockStart.until(workBlock.workBlockEnd).total({ unit: 'hour' });
          }
          return 0;
        })
        .reduce((acc, curr) => acc + curr, 0);
      return Math.round(preciseTotal * 10) / 10;
    },
  };

  const dateSelectionHandler = {
    add: function (date: Temporal.PlainDate) {
      setSelectedDates(prevSelectedDates => [...prevSelectedDates, date]);
    },
    remove: function (date: Temporal.PlainDate) {
      setSelectedDates(prevSelectedDates => prevSelectedDates.filter(d => !d.equals(date)));
    },
    selectSingleDay: async function (date: Temporal.PlainDate) {
      setMultiDaySelectionMode(false);
      discardSelectedJobsiteData();
      setLastSelectedSingleDate(date);
      await fetchDayTimesheetData(date);
      setSelectedDates([date]);
    },
    lastSelectedSingleDate: lastSelectedSingleDate,
    isSelected: function (date: Temporal.PlainDate) {
      return selectedDates.some(x => x.equals(date));
    },
    multiSelectionOn: function () {
      setMultiDaySelectionMode(true);
    },
    multiSelectionOff: async function () {
      await this.selectSingleDay(lastSelectedSingleDate);
    },
    switch: async function () {
      if (multiDaySelectionMode) {
        await this.multiSelectionOff();
      } else this.multiSelectionOn();
    },
    handleDateClick: function (date: Temporal.PlainDate) {
      if (!multiDaySelectionMode) {
        this.selectSingleDay(date);
        setTimesheetPageMode('view');
      } else {
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
    },
  };

  function discardSelectedJobsiteData() {
    setSelectedJobsiteData(null);
    setSuggestedJobsiteData(null);
  }

  function getDaysOfSelectedWeek() {
    const selectedWeekNumber = Math.floor(
      dateRange.from.until(dateSelectionHandler.lastSelectedSingleDate, {
        largestUnit: 'days',
        smallestUnit: 'days',
        roundingMode: 'trunc',
      }).days / 7,
    );

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
    const fetchFullData = async () => await fetchFullTimesheetData();
    fetchFullData();
  }, []);

  return (
    <TimesheetContext.Provider
      value={{
        dateRange,
        setDateRange,
        workData,
        setWorkData,
        multiDaySelectionMode,
        setMultiDaySelectionMode,
        selectedDates,
        setSelectedDates,
        lastSelectedSingleDate,
        setLastSelectedSingleDate,
        dateSelectionHandler,
        calendarMode,
        setCalendarMode,
        getDaysOfSelectedWeek,
        workDataAggregator,
        getRangeOfSelectedWeek,
        fetchFullTimesheetData,

        timesheetPageMode,
        setTimesheetPageMode,

        jobsiteSearchResults,
        setJobsiteSearchResults,
        selectedJobsiteData,
        setSelectedJobsiteData,
        suggestedJobsiteData,
        setSuggestedJobsiteData,
        handleSearchJobsites,
        discardSelectedJobsiteData,
        fetchDayTimesheetData,
        fetchMultipleDaysTimesheetData,
        handleAddWorkBlock,
        handleEditWorkBlock,
        handleDeleteWorkBlock,
        handleDiscard,
      }}
    >
      {children}
    </TimesheetContext.Provider>
  );
}

export function useTimesheetContext(): any {
  const context = useContext(TimesheetContext);
  if (!context) {
    throw new Error('useTimesheetContext must be used within a TimesheetProvider');
  }
  return context;
}

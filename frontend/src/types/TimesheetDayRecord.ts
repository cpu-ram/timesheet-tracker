import { Temporal } from '@js-temporal/polyfill';
import { WorkBlockData } from './WorkBlock.types.js';

export interface TimesheetDayRecord {
  date: Temporal.PlainDate;
  workBlocks: WorkBlockData[];
}

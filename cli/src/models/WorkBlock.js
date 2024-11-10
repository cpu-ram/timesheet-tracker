export default class WorkBlock {
  constructor({
    workStartTime, workEndTime, breakStartTime,
    breakEndTime,
  }) {
    this.workStartTime = workStartTime;
    this.workEndTime = workEndTime;
    this.breakStartTime = breakStartTime;
    this.breakEndTime = breakEndTime;
  }
}

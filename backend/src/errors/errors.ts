export class JobsiteConstraintError extends Error {
  constructor(message) {
    super(message);
    this.name = "JobsiteConstraintError";
  }
}
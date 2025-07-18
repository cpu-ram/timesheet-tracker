export class BackendError extends Error{
  status: number | null;

  constructor(message: string){
    super(message);
    this.status=null;
  }
}

export class JobsiteConstraintError extends BackendError {
  constructor(message: string) {
    super(message);
    this.name = "JobsiteConstraintError";
  }
}


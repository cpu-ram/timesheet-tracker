import { fetchSignUpCompletionStatusRecord } from "../../repositories/authRepository/fetchSignUpCompletionStatusRecord.js";

export async function getSignUpCompletionStatus(employeeId: number): Promise<boolean> {
  try {
    const status = await fetchSignUpCompletionStatusRecord(employeeId);
    return status;
  } catch (error) {
    throw new Error(`Error fetching sign-up completion status: ${error}`);
  }
}

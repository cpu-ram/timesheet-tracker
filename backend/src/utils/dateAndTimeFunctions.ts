const generateIsoTimestampString =
  ({ date, time }: { date: string; time: string }): string => {
    const result = date + "T" + time + ".000Z";
    return result;
  }

export { generateIsoTimestampString };
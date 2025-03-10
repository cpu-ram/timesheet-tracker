const updateWorkData = (newWorkData, setWorkData) => {
  setWorkData((prevWorkData) => (
    prevWorkData.map((prevWorkDay) => {
      const matchingFetchedDay = newWorkData.find((fetchedDay) => ((fetchedDay.date).equals(prevWorkDay.date)));
      if (matchingFetchedDay !== undefined) {
        return matchingFetchedDay;
      } else return prevWorkDay;
    })
  ));
}

export default updateWorkData;

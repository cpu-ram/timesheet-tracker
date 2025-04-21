type MatchGroup = {
  content: string;
  isMatched: boolean;
};

function findMatchIndices(corpus: string, query: string): number[] {

  const matchStartIndices: number[] = [];

  let index: number = corpus.toUpperCase().indexOf(query.toUpperCase(), 0);
  while (index != -1 && query.length > 0) {
    matchStartIndices.push(index);
    index = corpus.indexOf(query, index + 1);
  }

  return matchStartIndices;
}

function markMatchGroups(corpus: string, query: string): MatchGroup[] {

  let matchIndices: number[] = findMatchIndices(corpus, query);
  matchIndices = matchIndices.sort((a, b) => (b - a));

  let charMatchedTable: boolean[] = new Array(corpus.length).fill(false);
  let matchGroups: MatchGroup[] = [];

  let minPosition = -1;
  for (let matchIndex of matchIndices) {
    if (matchIndex + query.length > corpus.length) throw new Error("Internal logic error: faulty index search");


    for (let i = 0; i < query.length; i++) {
      if (matchIndex + i < minPosition) continue;
      charMatchedTable[matchIndex + i] = true;
    }
  }

  let currentMatchState = null;
  let stringBuilder = "";

  for (let i = 0; i < charMatchedTable.length; i++) {
    const currentChar = corpus[i];

    if (charMatchedTable[i] !== currentMatchState) {
      if (stringBuilder.length > 0 && currentMatchState !== null) {
        const matchGroup = { content: stringBuilder, isMatched: currentMatchState as boolean };
        matchGroups.push(matchGroup);
      }
      currentMatchState = charMatchedTable[i];
      stringBuilder = "" + (currentChar.toString());
    } else {
      stringBuilder += currentChar.toString();
    }
  }
  if (stringBuilder.length > 0 && currentMatchState !== null) {
    const matchGroup = { content: stringBuilder, isMatched: currentMatchState as boolean };
    matchGroups.push(matchGroup);
  }

  return matchGroups;
}

export { markMatchGroups };
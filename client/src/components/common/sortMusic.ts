// function de trie

const compare: any = (a: any, b: any, compareType: string) => {
  if (compareType === "indispo") {
    if (a.unavailable) {
      return -1;
    } else {
      return 1;
    }
  } else if (compareType === "validé") {
    if (a.isValid) {
      return -1;
    } else {
      return 1;
    }
  } else if (compareType === "voteup") {
    if (a.countVote > b.countVote) {
      return -1;
    } else {
      return 1;
    }
  } else if (compareType === "default") {
    if (a.id > b.id) {
      return -1;
    } else {
      return 1;
    }
  }
};
export default compare;

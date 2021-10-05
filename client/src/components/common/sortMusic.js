// function de trie
const compare = (a, b, compareType) => {
  if (compareType === "indispo") {
    if (a.unavailable === 1) {
      return -1;
    }
    if (b.unavailable === 0) {
      return 1;
    }
  } else if (compareType === "validé") {
    if (a.isValid === 1) {
      return -1;
    }
    if (b.isValid === 0) {
      return 1;
    }
  } else if (compareType === "voteup") {
    if (a.countVote > b.countVote) {
      return -1;
    } else {
      return 1;
    }
  }
};

module.exports = {
  compare: compare,
};

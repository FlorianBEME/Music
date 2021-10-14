const removeInput = (array) => {
  console.log(array);
  array.forEach((item) => {
    document.getElementById(item).value = "";
  });
};

module.exports = {
  removeInput: removeInput,
};

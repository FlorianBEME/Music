const removeInput = (array: string[]) => {
  console.log(array);
  array.forEach((item) => {
    const element = document.getElementById(item) as HTMLFormElement;
    element.value = "";
  });
};

export { removeInput };

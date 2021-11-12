const removeInput = (array: string[]) => {
  array.forEach((item) => {
    const element = document.getElementById(item) as HTMLFormElement;
    element.value = "";
  });
};

export { removeInput };

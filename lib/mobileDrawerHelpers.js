export const getYTranslate = (refCurrent) => {
  const style = window.getComputedStyle(refCurrent);
  const transformValue = style.getPropertyValue("transform");
  const yValue =
    transformValue === "none" ? 0 : parseInt(transformValue.split(",")[5]);
  return yValue;
};

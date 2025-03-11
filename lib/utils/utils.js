export const convertToPixels = (
  value,
  contextElement = document.documentElement,
) => {
  if (typeof value === "number") return value; // Already in pixels

  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  const parentFontSize = parseFloat(getComputedStyle(contextElement).fontSize);

  const unit = value.match(/[a-z%]+$/)?.[0]; // Extract unit
  const num = parseFloat(value); // Extract number

  switch (unit) {
    case "px":
      return num;
    case "vh":
      return (num / 100) * viewportHeight;
    case "vw":
      return (num / 100) * viewportWidth;
    case "rem":
      return num * rootFontSize;
    case "em":
      return num * parentFontSize;
    case "%":
      return (num / 100) * contextElement.clientHeight; // Relative to parent
    default:
      throw new Error("Unsupported unit: " + unit);
  }
};

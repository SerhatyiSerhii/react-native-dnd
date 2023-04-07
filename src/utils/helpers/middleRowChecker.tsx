export const middleRowChecker = (
  x: number,
  y: number,
  width: number,
  height: number,
  rightCol: number,
  bottomRow: number
) => {
  return x >= width && x <= rightCol && y >= height && y <= bottomRow;
};

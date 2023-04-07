export const bottomRowChecker = (
  x: number,
  y: number,
  leftCol: number,
  rightCol: number,
  bottomRow: number
) => {
  return x >= leftCol && x <= rightCol && y >= bottomRow;
};

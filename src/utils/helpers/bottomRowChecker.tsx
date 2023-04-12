export const bottomRowChecker = (
  mouseX: number,
  x: number,
  y: number,
  leftCol: number,
  rightCol: number,
  bottomRow: number
) => {
  return (
    mouseX >= leftCol && x <= rightCol && y >= bottomRow && mouseX <= rightCol
  );
};

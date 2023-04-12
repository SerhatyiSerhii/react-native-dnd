export const rightColumnChecker = (
    mouseX: number,
    x: number,
    y: number,
    width: number,
    height: number,
    leftCol: number,
    rightCol: number,
    bottomRow: number
  ) => {
    return (
      x >= width &&
      x >= leftCol &&
      mouseX <= rightCol &&
      (y <= height || (y >= height && y < bottomRow))
    );
  };

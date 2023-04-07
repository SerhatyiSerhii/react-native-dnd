export const rightColumnChecker = (
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
      x <= rightCol &&
      (y <= height || (y >= height && y < bottomRow))
    );
  };

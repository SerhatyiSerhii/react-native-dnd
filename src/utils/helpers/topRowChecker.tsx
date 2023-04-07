export const topRowChecker = (
    x: number,
    y: number,
    width: number,
    height: number,
    rightCol: number
  ) => {
    return x >= width && x <= rightCol && y <= height;
  };

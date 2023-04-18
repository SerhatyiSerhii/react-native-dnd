import React from "react";
import { rightColumnChecker } from "./rightColumnChecker";
import { topRowChecker } from "./topRowChecker";
import { middleRowChecker } from "./middleRowChecker";
import { bottomRowChecker } from "./bottomRowChecker";

export const landerRenderer = (
  lander: HTMLElement,
  event: React.DragEvent,
  rect: DOMRect
) => {
  const halfWidth = rect.width / 2;
  const width = rect.width;
  const halfHeight = rect.height / 2;
  const height = rect.height;
  const perc01 = 0.1;
  const perc06 = 0.6;
  const perc07 = 0.7;
  const perc09 = 0.9;
  const left50 = 50;
  const right50 = width - 50;
  const border = 1;
  const doubleBorder = border * 2;
  const twoDoubleBorders = doubleBorder * 2;
  const rightColumn = width * perc07;
  const bottomRow = height * perc09;

  // if (
  //   rightColumnChecker(
  //     event.clientX ,
  //     event.clientX - rect.x,
  //     event.clientY - rect.y,
  //     rightColumn,
  //     halfHeight,
  //     left50,
  //     window.screen.width - 50,
  //     bottomRow
  //   )
  // ) {
  //   lander.style.width = `${halfWidth - doubleBorder}px`;
  //   lander.style.height = `${height - twoDoubleBorders}px`;
  //   lander.style.top = `${rect.y + doubleBorder}px`;
  //   lander.style.left = `${rect.x + halfWidth}px`;
  //   lander.id = 'right-col';
  // } else if (
  //   topRowChecker(
  //     event.clientX - rect.x,
  //     event.clientY,
  //     halfWidth * perc06,
  //     halfHeight,
  //     right50
  //   )
  // ) {
  //   lander.style.width = `${width - twoDoubleBorders}px`;
  //   lander.style.height = `${halfHeight - doubleBorder}px`;
  //   lander.style.top = `${rect.y + doubleBorder}px`;
  //   lander.style.left = `${rect.x + doubleBorder}px`;
  //   lander.id = 'top-row';
  // } else if (
  //   middleRowChecker(
  //     event.clientX - rect.x,
  //     event.clientY,
  //     halfWidth * perc06,
  //     halfHeight,
  //     right50,
  //     bottomRow
  //   )
  // ) {
  //   lander.style.width = `${width - twoDoubleBorders}px`;
  //   lander.style.height = `${halfHeight - doubleBorder}px`;
  //   lander.style.top = `${rect.y + halfHeight}px`;
  //   lander.style.left = `${rect.x + doubleBorder}px`;
  //   lander.id = 'bottom-row';
  // } else if (
  //   bottomRowChecker(event.clientX, event.clientX - rect.x, event.clientY, left50, window.screen.width - 50, bottomRow)
  // ) {
  //   lander.style.width = `${window.screen.width - twoDoubleBorders}px`;
  //   lander.style.height = `${height * perc01 - doubleBorder}px`;
  //   lander.style.top = `${rect.y + height * perc09}px`;
  //   lander.style.left = `${doubleBorder}px`;
  //   lander.id = 'footer';
  // } else if (event.clientX <= left50) {
  //   lander.style.width = `${left50 - doubleBorder}px`;
  //   lander.style.height = `${height - twoDoubleBorders}px`;
  //   lander.style.top = `${rect.y + doubleBorder}px`;
  //   lander.style.left = `${rect.x + doubleBorder}px`;
  //   lander.id = 'left-aside';
  // } else if (event.clientX >= window.screen.width - 50) {
  //   lander.style.width = `${left50 - doubleBorder}px`;
  //   lander.style.height = `${height - twoDoubleBorders}px`;
  //   lander.style.top = `${rect.y + doubleBorder}px`;
  //   lander.style.left = `${rect.x + right50}px`;
  //   lander.id = 'right-aside';
  // } else {
  //   lander.style.width = `${halfWidth - doubleBorder}px`;
  //   lander.style.height = `${height - twoDoubleBorders}px`;
  //   lander.style.top = `${rect.y + doubleBorder}px`;
  //   lander.style.left = `${rect.x + doubleBorder}px`;
  //   lander.id = 'left-col';
  // }

  // Left col
  if (event.clientX - rect.x >= 50 && event.clientX - rect.x < rightColumn) {
    lander.style.width = `${halfWidth - doubleBorder}px`;
    lander.style.height = `${height - twoDoubleBorders}px`;
    lander.style.top = `${rect.y + doubleBorder}px`;
    lander.style.left = `${rect.x + doubleBorder}px`;
    lander.id = "left-col";
  }

  // Right col
  if (event.clientX - rect.x >= rightColumn) {
    lander.style.width = `${halfWidth - doubleBorder}px`;
    lander.style.height = `${height - twoDoubleBorders}px`;
    lander.style.top = `${rect.y + doubleBorder}px`;
    lander.style.left = `${rect.x + halfWidth}px`;
    lander.id = 'right-col';
  }

  // Top row
  if (
    event.clientY - rect.y < halfHeight &&
    event.clientX - rect.x > width * 0.3 &&
    event.clientX - rect.x < rightColumn
  ) {
    lander.style.width = `${width - twoDoubleBorders}px`;
    lander.style.height = `${halfHeight - doubleBorder}px`;
    lander.style.top = `${rect.y + doubleBorder}px`;
    lander.style.left = `${rect.x + doubleBorder}px`;
    lander.id = "top-row";
  }

  // Bottom row
  if (
    event.clientY - rect.y > halfHeight &&
    event.clientX - rect.x > width * 0.3 &&
    event.clientX - rect.x < rightColumn
  ) {
    lander.style.width = `${width - twoDoubleBorders}px`;
    lander.style.height = `${halfHeight - doubleBorder}px`;
    lander.style.top = `${rect.y + halfHeight}px`;
    lander.style.left = `${rect.x + doubleBorder}px`;
    lander.id = "bottom-row";
  }
};

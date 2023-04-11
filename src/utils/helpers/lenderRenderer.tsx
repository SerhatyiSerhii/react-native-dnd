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
  const doubleBorder = 2;
  const twoDoubleBorders = doubleBorder * 2;
  const rightColumn = width * perc07;
  const bottomRow = height * perc09;

  if (
    rightColumnChecker(
      event.clientX,
      event.clientY,
      rightColumn,
      halfHeight,
      left50,
      right50,
      bottomRow
    )
  ) {
    lander.style.width = "50%";
    lander.style.height = `${height - twoDoubleBorders}px`;
    lander.style.top = "1px";
    lander.style.left = `${halfWidth - doubleBorder}px`;
    lander.id = 'right-col';
  } else if (
    topRowChecker(
      event.clientX,
      event.clientY,
      halfWidth * perc06,
      halfHeight,
      right50
    )
  ) {
    lander.style.width = `${width - twoDoubleBorders}px`;
    lander.style.height = "50%";
    lander.style.top = "1px";
    lander.style.left = "1px";
    lander.id = 'top-row';
  } else if (
    middleRowChecker(
      event.clientX,
      event.clientY,
      halfWidth * perc06,
      halfHeight,
      right50,
      bottomRow
    )
  ) {
    lander.style.width = `${width - twoDoubleBorders}px`;
    lander.style.height = "50%";
    lander.style.top = `${halfHeight - doubleBorder}px`;
    lander.style.left = "1px";
    lander.id = 'bottom-row';
  } else if (
    bottomRowChecker(event.clientX, event.clientY, left50, right50, bottomRow)
  ) {
    lander.style.width = `${width - twoDoubleBorders}px`;
    lander.style.height = `${height * perc01 - border}px`;
    lander.style.top = "90%";
    lander.style.left = "1px";
    lander.id = 'footer';
  } else if (event.clientX <= left50) {
    lander.style.width = "50px";
    lander.style.height = `${height - twoDoubleBorders}px`;
    lander.style.top = "1px";
    lander.style.left = "1px";
    lander.id = 'left-aside';
  } else if (event.clientX >= right50) {
    lander.style.width = "50px";
    lander.style.height = `${height - twoDoubleBorders}px`;
    lander.style.top = "1px";
    lander.style.left = `${right50 - doubleBorder - border}px`;
    lander.id = 'right-aside';
  } else {
    lander.style.width = "50%";
    lander.style.height = `${height - twoDoubleBorders}px`;
    lander.style.top = "1px";
    lander.style.left = "1px";
    lander.id = 'left-col';
  }
};

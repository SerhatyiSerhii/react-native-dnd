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
  const perc06 = 0.6;
  const perc07 = 0.7;
  const perc09 = 0.9;
  const left50 = 50;
  const right50 = width - 50;
  const border = 2;
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
    lander.style.height = "100%";
    lander.style.top = "0";
    lander.style.left = "50%";
  } else if (
    topRowChecker(
      event.clientX,
      event.clientY,
      halfWidth * perc06,
      halfHeight,
      right50
    )
  ) {
    lander.style.width = "100%";
    lander.style.height = "50%";
    lander.style.top = "0";
    lander.style.left = "0";
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
    lander.style.width = "100%";
    lander.style.height = "50%";
    lander.style.top = "50%";
    lander.style.left = "0";
  } else if (
    bottomRowChecker(event.clientX, event.clientY, left50, right50, bottomRow)
  ) {
    lander.style.width = "100%";
    lander.style.height = "10%";
    lander.style.top = "90%";
    lander.style.left = "0";
  } else if (event.clientX <= left50) {
    lander.style.width = "50px";
    lander.style.height = "100%";
    lander.style.top = "0";
    lander.style.left = "0";
  } else if (event.clientX >= right50) {
    lander.style.width = "50px";
    lander.style.height = "100%";
    lander.style.top = "0";
    lander.style.left = right50 - border + "px";
  } else {
    lander.style.width = "50%";
    lander.style.height = "100%";
    lander.style.top = "0";
    lander.style.left = "0";
  }
};

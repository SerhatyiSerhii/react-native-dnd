import React from "react";

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

  if (
    event.clientX >= width * perc07 &&
    event.clientX >= left50 &&
    event.clientX <= right50 &&
    (event.clientY <= halfHeight ||
      (event.clientY >= halfHeight && event.clientY < height * perc09))
  ) {
    lander.style.width = "50%";
    lander.style.height = "100%";
    lander.style.top = "0";
    lander.style.left = "50%";
  } else if (
    event.clientX >= halfWidth * perc06 &&
    event.clientX <= right50 &&
    event.clientY <= halfHeight
  ) {
    lander.style.width = "100%";
    lander.style.height = "50%";
    lander.style.top = "0";
    lander.style.left = "0";
  } else if (
    event.clientX >= halfWidth * perc06 &&
    event.clientX <= right50 &&
    event.clientY >= halfHeight &&
    event.clientY <= height * perc09
  ) {
    lander.style.width = "100%";
    lander.style.height = "50%";
    lander.style.top = "50%";
    lander.style.left = "0";
  } else if (
    event.clientX >= halfWidth &&
    event.clientX <= right50 &&
    event.clientY >= halfHeight &&
    event.clientY <= height * perc09
  ) {
    lander.style.width = "50%";
    lander.style.height = "100%";
    lander.style.top = "0";
    lander.style.left = "50%";
  } else if (
    event.clientX <= halfWidth &&
    event.clientX >= left50 &&
    event.clientY >= halfHeight &&
    event.clientY <= height * perc09
  ) {
    lander.style.width = "50%";
    lander.style.height = "100%";
    lander.style.top = "0";
    lander.style.left = "0";
  } else if (
    event.clientX >= left50 &&
    event.clientX <= right50 &&
    event.clientY >= height * perc09
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

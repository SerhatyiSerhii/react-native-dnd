import React from "react";

export const landerRenderer = (
  lander: HTMLElement,
  event: React.DragEvent,
  rect: DOMRect
) => {
  if (event.clientX >= rect!.width / 2 && event.clientY <= rect!.height / 2) {
    lander!.style.width = "50%";
    lander!.style.height = "100%";
    lander!.style.top = "0";
    lander!.style.left = "50%";
  } else if (
    event.clientX >= rect!.width / 2 &&
    event.clientY >= rect!.height / 2
  ) {
    lander!.style.width = "50%";
    lander!.style.height = "50%";
    lander!.style.top = "50%";
    lander!.style.left = "50%";
  } else if (
    event.clientX <= rect!.width / 2 &&
    event.clientY >= rect!.height / 2
  ) {
    lander!.style.width = "50%";
    lander!.style.height = "50%";
    lander!.style.top = "50%";
    lander!.style.left = "0";
  } else {
    lander!.style.width = "50%";
    lander!.style.height = "100%";
    lander!.style.top = "0";
    lander!.style.left = "0";
  }
};

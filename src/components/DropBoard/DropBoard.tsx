import React, { useRef } from "react";
import { DragBox } from "../DragBox/DragBox";
import "./DropBoard.scss";
import { landerRenderer } from "../../utils/helpers/LanderRenderer";

export const DropBoard = () => {
  const dropArea = useRef<HTMLDivElement>(null);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const element_id = event.dataTransfer.getData("widgetType");
    const element = document.getElementsByClassName(element_id).item(0)!;

    (element as HTMLElement).style.top = `${event.clientY}px`;
    (element as HTMLElement).style.left = `${event.clientX}px`;

    const lander: HTMLElement | null = document.querySelector(".lander");

    lander?.remove();
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();

    const lander: HTMLElement | null = document.querySelector(".lander");

    const rect: DOMRect | undefined =
      dropArea.current?.getBoundingClientRect()!;

    landerRenderer(lander!, event, rect!);
  };

  return (
    <div
      ref={dropArea}
      className="drop-area"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <DragBox />
    </div>
  );
};

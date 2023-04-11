import React, { useCallback, useRef, useState } from "react";
import "./DropBoard.scss";
import { landerRenderer } from "../../utils/helpers/lenderRenderer";

export const DropBoard = () => {
  const dropArea = useRef<HTMLDivElement>(null);

  const [draggingEl, setDragginEl] = useState<EventTarget | null>(null);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const element_id = event.dataTransfer.getData("widgetType");
    const element = document.getElementsByClassName(element_id).item(0)!;

    const lander: HTMLElement | null = document.querySelector(".lander");

    if (lander?.id === 'right-col') {
      dropArea.current?.append(element);
    }

    if (lander?.id === 'left-col') {
      dropArea.current?.prepend(element);
    }

    element.removeAttribute('style');

    lander?.remove();
  };

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const lander: HTMLElement | null = document.querySelector(".lander");

    (draggingEl as HTMLElement).style.top = event.clientY + 'px';
    (draggingEl as HTMLElement).style.left = event.clientX + 'px';
    (draggingEl as HTMLElement).style.transform = 'scale(0.1)';
    (draggingEl as HTMLElement).style.transformOrigin = '0 0';

    const rect: DOMRect | undefined =
      dropArea.current?.getBoundingClientRect()!;

    landerRenderer(lander!, event, rect!);
  }, [draggingEl]);

  const handleDragStart = (event: React.DragEvent, widgetType: string) => {
    event.dataTransfer.setData("widgetType", widgetType);
    event.dataTransfer.setDragImage(new Image(), 0, 0);

    setDragginEl(event.target);

    (event.target as HTMLElement).style.position = 'absolute';

    const newDiv = document.createElement('div');

    newDiv.classList.add('lander');

    dropArea.current?.appendChild(newDiv);
  };

  const dissablePointerEvents = (event: React.DragEvent) => {
    (event.target as HTMLElement).style.pointerEvents = 'none';
  }

  return (
    <div className="drop-area_root">
      <div
        ref={dropArea}
        className="drop-area_row"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="drag-item q1" draggable onDragStart={(e) => handleDragStart(e, "drag-item q1")} onDrag={dissablePointerEvents}></div>
        <div className="drag-item q2" draggable onDragStart={(e) => handleDragStart(e, "drag-item q2")} onDrag={dissablePointerEvents}></div>
      </div>
    </div>
  );
};

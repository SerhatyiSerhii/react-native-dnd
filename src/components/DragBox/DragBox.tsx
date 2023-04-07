import React, { useRef } from "react";
import "./DragBox.scss";

export const DragBox = () => {
  const drag = useRef<HTMLDivElement>(null);

  const handleDragStat = (event: React.DragEvent, widgetType: string) => {
    event.dataTransfer.setData("widgetType", widgetType);
    event.dataTransfer.setDragImage((event.target as Element), 0, 0);

    const newDiv = document.createElement('div');

    newDiv.classList.add('lander');

    document.querySelector('.drop-area')?.appendChild(newDiv);
  };

  return (
    <div
      className="drag-box"
      draggable
      onDragStart={(e) => handleDragStat(e, "drag-box")}
      ref={drag}
    >
      Hello World!
    </div>
  );
};

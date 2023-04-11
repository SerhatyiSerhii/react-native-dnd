import React, { useRef } from "react";
import "./DragBox.scss";

type dragBoxProps = {
  dropArea: React.RefObject<HTMLDivElement>
}

export const DragBox = ({dropArea}: dragBoxProps) => {
  const drag = useRef<HTMLDivElement>(null);

  const handleDragStart = (event: React.DragEvent, widgetType: string) => {
    event.dataTransfer.setData("widgetType", widgetType);
    event.dataTransfer.setDragImage((event.target as Element), 0, 0);

    const newDiv = document.createElement('div');

    newDiv.classList.add('lander');

    dropArea.current?.appendChild(newDiv);
  };

  return (
    <div
      className="drag-box"
      draggable
      onDragStart={(e) => handleDragStart(e, "drag-box")}
      ref={drag}
    >
      Hello World!
    </div>
  );
};

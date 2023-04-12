import React, { useCallback, useState } from "react";
import { landerRenderer } from "../../utils/helpers/lenderRenderer";
import "./DropBoard.scss";

type itemType  = {
  id: number,
  order: number
}

export const DropBoard = () => {
  const [draggingEl, setDragginEl] = useState<EventTarget | null>(null);
  const [currentEl, setCurrentEl] = useState<itemType | null>(null);

  const [sections, setSections] = useState<itemType[]>([
    {
      id: 1,
      order: 1
    },
    {
      id: 2,
      order: 2
    },
    {
      id: 3,
      order: 3
    },
    {
      id: 4,
      order: 4
    }
  ]);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const element_id = event.dataTransfer.getData("widgetType");
    const element = document.getElementsByClassName(element_id).item(0)!;

    const lander: HTMLElement | null = document.querySelector(".lander");

    if (lander?.id === "right-col") {
      setSections([...sections.filter(section => section !== currentEl), currentEl!]);
    }

    if (lander?.id === "left-col") {
      setSections([currentEl!, ...sections.filter(section => section !== currentEl)]);
    }

    element.removeAttribute("style");

    document.querySelector('.manager')?.classList.remove('dragging');

    setDragginEl(null);
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent, item: itemType) => {
      event.preventDefault();

      const lander: HTMLElement | null = document.querySelector(".lander");

      (draggingEl as HTMLElement).style.top = event.clientY + "px";
      (draggingEl as HTMLElement).style.left = event.clientX + "px";
      (draggingEl as HTMLElement).style.transform = "scale(0.1)";
      (draggingEl as HTMLElement).style.transformOrigin = "0 0";

      // const rect = document.querySelector('.manager')?.getBoundingClientRect();
      const rect = (event.target as HTMLElement).getBoundingClientRect();

      landerRenderer(lander!, event, rect!);
    },
    [draggingEl, sections]
  );

  const handleDragStart = (event: React.DragEvent, widgetType: string, item: itemType) => {
    event.dataTransfer.setData("widgetType", widgetType);
    event.dataTransfer.setDragImage(new Image(), 0, 0);

    setDragginEl(event.target);
    setCurrentEl(item);

    (event.target as HTMLElement).style.position = "absolute";

    document.querySelector('.manager')?.classList.add('dragging');
  };

  const dissablePointerEvents = (event: React.DragEvent) => {
    (event.target as HTMLElement).style.pointerEvents = "none";
  };

  return (
    <div className="container">
      <div className="manager">
        <div
          className="drop-area_row"
        >
          {
            sections.map((section) => {
              return (
                <div
                  key={section.id}
                  className={`drag-item q${section.id}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, `drag-item q${section.id}`, section)}
                  onDragOver={(e) => handleDragOver(e, section)}
                  onDrag={dissablePointerEvents}
                  onDrop={handleDrop}
                ></div>
              );
            })
          }
        </div>
        <div className="lander" />
      </div>
    </div>
  );
};

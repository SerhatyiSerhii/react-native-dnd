import React, { useCallback, useState } from "react";
import { landerRenderer } from "../../utils/helpers/lenderRenderer";
import "./DropBoard.scss";

export const DropBoard = () => {
  const [draggingEl, setDragginEl] = useState<EventTarget | null>(null);
  const [sections, setSections] = useState([
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
    }
  ]);

  const handleDrop = (event: React.DragEvent, item: any) => {
    event.preventDefault();

    const element_id = event.dataTransfer.getData("widgetType");
    const element = document.getElementsByClassName(element_id).item(0)!;

    const lander: HTMLElement | null = document.querySelector(".lander");

    if (lander?.id === "right-col") {
      setSections([item, ...sections.filter(section => section != item)]);
    }

    if (lander?.id === "left-col") {
      console.log(sections.filter(section => section != item));
      setSections([...sections.filter(section => section != item), item]);
    }

    element.removeAttribute("style");

    document.querySelector('.manager')?.classList.remove('dragging');

    setDragginEl(null);
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const lander: HTMLElement | null = document.querySelector(".lander");

      (draggingEl as HTMLElement).style.top = event.clientY + "px";
      (draggingEl as HTMLElement).style.left = event.clientX + "px";
      (draggingEl as HTMLElement).style.transform = "scale(0.1)";
      (draggingEl as HTMLElement).style.transformOrigin = "0 0";

      const rect = document.querySelector('.manager')?.getBoundingClientRect();

      landerRenderer(lander!, event, rect!);
    },
    [draggingEl, sections]
  );

  const handleDragStart = (event: React.DragEvent, widgetType: string) => {
    event.dataTransfer.setData("widgetType", widgetType);
    event.dataTransfer.setDragImage(new Image(), 0, 0);

    setDragginEl(event.target);

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
                  onDragStart={(e) => handleDragStart(e, `drag-item q${section.id}`)}
                  onDragOver={handleDragOver}
                  onDrag={dissablePointerEvents}
                  onDrop={(e) => handleDrop(e, section)}
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

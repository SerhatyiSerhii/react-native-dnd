import React, { useCallback, useState } from "react";
import { landerRenderer } from "../../utils/helpers/lenderRenderer";
import "./DropBoard.scss";

type itemType  = {
  id: number,
  order?: number,
  rows?: itemType[]
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

  const handleDrop = (event: React.DragEvent, item: itemType) => {
    event.preventDefault();

    const element_id = event.dataTransfer.getData("widgetType");
    const element = document.getElementsByClassName(element_id).item(0)!;

    const lander: HTMLElement | null = document.querySelector(".lander");

    if (lander?.id === "right-col") {
      const filteredSections = sections.map(section => {
        if (section.hasOwnProperty('rows')) {
          section.rows = section.rows?.filter(row => row !== currentEl);
          return section.rows!.length > 1 ? section : section.rows![0];
        }
        return section;
      }).filter(section => section !== currentEl);

      const index = filteredSections.indexOf(item);
      filteredSections.splice(index + 1, 0, currentEl!);
      setSections(filteredSections);
    }

    if (lander?.id === "left-col") {
      const filteredSections = sections.map(section => {
        if (section.hasOwnProperty('rows')) {
          section.rows = section.rows?.filter(row => row !== currentEl);
          return section.rows!.length > 1 ? section : section.rows![0];
        }
        return section;
      }).filter(section => section !== currentEl);

      const index = filteredSections.indexOf(item);
      filteredSections.splice(index, 0, currentEl!);
      setSections(filteredSections);
    }

    if (lander?.id === "bottom-row") {
      let filteredSections = sections.filter(section => section !== currentEl);

      const index = filteredSections.indexOf(item);

      if (index < 0) {
        const originColumn = filteredSections.filter((section) => section.hasOwnProperty('rows')).find((columns) => columns.rows?.includes(currentEl!));

        if (originColumn) {
          originColumn!.rows = originColumn?.rows?.filter(row => row !== currentEl);
        }

        const targetColumn = filteredSections.filter((section) => section.hasOwnProperty('rows')).find((columns) => columns.rows?.includes(item));

        targetColumn!.rows = targetColumn!.rows!.filter(row => row !== currentEl);

        const targetIndex = targetColumn!.rows!.indexOf(item);

        targetColumn?.rows?.splice(targetIndex + 1, 0, currentEl!);

        filteredSections = filteredSections.map((section) => {
          if (section.rows?.length === 1) {
            return section.rows[0];
          }

          return section;
        });

        setSections(filteredSections);
      } else {
        let deepFilter = sections.filter(section => section !== currentEl && section !== item);

        const newColumn = deepFilter.find(section => section.hasOwnProperty('rows'));

        if (newColumn) {
          newColumn.rows = newColumn.rows?.filter(row => row !== currentEl);

          deepFilter = deepFilter.map((section) => {
            if (section.hasOwnProperty('rows')) {
              section.rows = section.rows?.filter(row => row !== currentEl);
              return section.rows!.length > 1 ? section : section.rows![0];
            }

            return section;
          });
        }

        const column = {
          id: sections.length + 1,
          rows: [item, currentEl!]
        }

        deepFilter.splice(index, 0, column);

        setSections(deepFilter);
      }
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

      const rect = (event.target as HTMLElement).getBoundingClientRect();

      landerRenderer(lander!, event, rect!);
    },
    [draggingEl]
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

  const drowElements = (arr: itemType[]) => {
    return arr.map((item) => {
      if ('rows' in item) {
        return (
          <div key={item.id} className={`drag-item col`}>
            {
              drowElements(item.rows!)
            }
          </div>
        );
      }

      return (
        <div
          key={item.id}
          className={`drag-item q${item.id}`}
          draggable
          onDragStart={(e) => handleDragStart(e, `drag-item q${item.id}`, item)}
          onDragOver={(e) => handleDragOver(e)}
          onDrag={dissablePointerEvents}
          onDrop={(e) => handleDrop(e, item)}
        ></div>
      );
    });
  }

  return (
    <div className="container">
      <div className="manager">
        <div
          className="drop-area_row"
        >
          {drowElements(sections)}
        </div>
        <div className="lander" />
      </div>
    </div>
  );
};

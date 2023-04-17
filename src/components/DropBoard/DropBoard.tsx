import React, { useCallback, useState } from "react";
import { landerRenderer } from "../../utils/helpers/lenderRenderer";
import "./DropBoard.scss";

type configType = {
  type: string;
  id: string;
  parentId: string;
  content: (configType | componentType)[];
};

type componentType = {
  type: string;
  componentName: string;
  componentState: { label: string };
  id: string;
  parentId: string;
};

export const DropBoard = () => {
  const [draggingEl, setDragginEl] = useState<EventTarget | null>(null);
  const [currentEl, setCurrentEl] = useState<componentType | null>(null);

  const [config, setConfig] = useState<configType[]>([
    {
      type: "row",
      id: "row-1",
      parentId: "top-parent",
      content: [
        {
          type: "component",
          componentName: "test_name",
          componentState: { label: "A" },
          id: "1",
          parentId: "row-1",
        },
        {
          type: "component",
          componentName: "test_name",
          componentState: { label: "B" },
          id: "2",
          parentId: "row-1",
        },
        {
          type: "component",
          componentName: "test_name",
          componentState: { label: "C" },
          id: "3",
          parentId: "row-1",
        },
        {
          type: "component",
          componentName: "test_name",
          componentState: { label: "D" },
          id: "4",
          parentId: "row-1",
        },
      ],
    },
  ]);

  const handleDrop = (event: React.DragEvent, targetElem: componentType) => {
    event.preventDefault();

    const element_id = event.dataTransfer.getData("widgetType");
    const element = document.getElementsByClassName(element_id).item(0)!;

    const lander: HTMLElement | null = document.querySelector(".lander");

    if (lander?.id === "right-col") {
      const selector = function (arr: any[]) {
        return arr
          .filter((item) => {
            if (item.content) {
              item.content = selector(item.content);
            }

            return item.id !== currentEl!.id;
          })
          .map((item: any) => {
            if (item.content) {
              const targetIndex = item.content.findIndex(
                (i: any) => i.id === targetElem.id
              );

              item.content.splice(targetIndex + 1, 0, currentEl);
            }

            return item;
          });
      };

      const newConf: configType[] = selector(
        JSON.parse(JSON.stringify(config))
      );

      setConfig(newConf);
    }

    if (lander?.id === "left-col") {
      const findParent = function (
        arr: (configType | componentType)[]
      ): configType | componentType | undefined {
        for (let i of arr) {
          if (i.id === targetElem.parentId) {
            return i;
          }

          if ((i as configType)?.content) {
            return findParent((i as configType).content);
          }
        }
      };

      const filter = function (arr: (configType | componentType)[]) {
        return arr.filter((item) => {
          if ((item as configType).content) {
            (item as configType).content = filter((item as configType).content);
          }

          return item.id !== currentEl?.id;
        });
      };

      const configCopy = filter(JSON.parse(JSON.stringify(config))) as configType[];

      const parentElement = findParent(configCopy) as configType;

      if (parentElement) {
        const targetElIndex = parentElement.content.findIndex(
          (el) => el.id === targetElem.id
        );

        if (parentElement.type === 'column' && !targetElem.parentId.includes("row") && targetElIndex >= 0) {
          const row: configType = {
            type: "row",
            id: "row-1",
            parentId: targetElem.parentId,
            content: [currentEl!, targetElem],
          };

          targetElem.parentId = row.id;
          currentEl!.parentId = row.id;

          parentElement.content[targetElIndex] = row;
        } else {
          currentEl!.parentId = targetElem.parentId;
          parentElement.content.splice(targetElIndex, 0, currentEl!);
        }
      }

      setConfig(configCopy.map(item => {
        if (item.content.length === 1 && (item.type === 'row' || item.type === 'column')) {
          item.content[0].parentId = 'top-parent';
          return item.content[0];
        }

        return item;
      }) as configType[]);
    }

    if (lander?.id === "bottom-row") {
      const findParent = function (
        arr: (configType | componentType)[]
      ): configType | componentType | undefined {
        for (let i of arr) {
          if (i.id === targetElem.parentId) {
            return i;
          }

          if ((i as configType)?.content) {
            return findParent((i as configType).content);
          }
        }
      };

      const filter = function (arr: (configType | componentType)[]) {
        return arr.filter((item) => {
          if ((item as configType).content) {
            (item as configType).content = filter((item as configType).content);
          }

          return item.id !== currentEl?.id;
        });
      };

      const configCopy = filter(
        JSON.parse(JSON.stringify(config))
      ) as configType[];

      const parentElement = findParent(configCopy) as configType;

      if (parentElement) {
        const targetElIndex = parentElement.content.findIndex(
          (el) => el.id === targetElem.id
        );

        if (parentElement.type === 'row' && !targetElem.parentId.includes("column") && targetElIndex >= 0) {
          const column: configType = {
            type: "column",
            id: "column-1",
            parentId: targetElem.parentId,
            content: [targetElem, currentEl!],
          };

          targetElem.parentId = column.id;
          currentEl!.parentId = column.id;

          parentElement.content[targetElIndex] = column;
        } else {
          currentEl!.parentId = targetElem.parentId;
          parentElement.content.splice(targetElIndex + 1, 0, currentEl!);
        }
      }

      setConfig(configCopy.map(item => {
        if (item.content.length === 1 && (item.type === 'row' || item.type === 'column')) {
          item.content[0].parentId = 'top-parent';
          return item.content[0];
        }

        return item;
      }) as configType[]);
    }

    element.removeAttribute("style");

    document.querySelector(".manager")?.classList.remove("dragging");

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

  const handleDragStart = (
    event: React.DragEvent,
    widgetType: string,
    item: componentType
  ) => {
    event.dataTransfer.setData("widgetType", widgetType);
    event.dataTransfer.setDragImage(new Image(), 0, 0);

    setDragginEl(event.target);
    setCurrentEl(JSON.parse(JSON.stringify(item)));

    (event.target as HTMLElement).style.position = "absolute";

    document.querySelector(".manager")?.classList.add("dragging");
  };

  const dissablePointerEvents = (event: React.DragEvent) => {
    (event.target as HTMLElement).style.pointerEvents = "none";
  };

  const drowElements = (arr: (componentType | configType)[]) => {
    return arr.map((item) => {
      if (item.type === "stack" || item.type === "row") {
        return (
          <div key={item.id} className={item.type}>
            {drowElements((item as configType).content)}
          </div>
        );
      }

      if (item.type === "column") {
        return (
          <div key={item.id} className={item.type}>
            {drowElements((item as configType).content)}
          </div>
        );
      }

      return (
        <div
          key={item.id}
          className={`drag-item q${item.id}`}
          draggable
          onDragStart={(e) =>
            handleDragStart(e, `drag-item q${item.id}`, item as componentType)
          }
          onDragOver={(e) => handleDragOver(e)}
          onDrag={dissablePointerEvents}
          onDrop={(e) => handleDrop(e, item as componentType)}
        ></div>
      );
    });
  };

  return (
    <div className="container">
      <div className="manager">
        {drowElements(config)}
        <div className="lander" />
      </div>
    </div>
  );
};

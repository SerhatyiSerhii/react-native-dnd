import React, { useState } from "react";
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
  const [columnId, setColumnId] = useState<number>(0);
  const [rowId, setRowId] = useState<number>(1);
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

  const configFilter = function (arr: (configType | componentType)[]) {
    for (let i = 0; i < arr.length; i++) {
      if (
        (arr[i] as configType)?.content &&
        (arr[i] as configType)?.content.length === 0
      ) {
        arr.splice(i, 1);
        i--;
      }

      if (
        (arr[i] as configType)?.content &&
        (arr[i] as configType)?.content.length
      ) {
        configFilter((arr[i] as configType)?.content);
      }

      if (
        (arr[i] as configType)?.content &&
        (arr[i] as configType)?.content.length === 1 &&
        (arr[i] as configType)?.content.every((el) => el.type !== "component")
      ) {
        arr[i] = (arr[i] as configType)?.content[0];

        arr[i].parentId = "top-parent";
      }

      if (
        (arr[i] as configType)?.content &&
        (arr[i] as configType)?.content.length === 1 &&
        (arr[i] as configType)?.content.every((el) => el.type === "component")
      ) {
        (arr[i] as configType).content[0].parentId = arr[i].parentId;

        arr[i] = (arr[i] as configType).content[0];
      }

      if (
        (arr[i] as configType)?.content?.some((el) => el.type === arr[i].type)
      ) {
        const index = (arr[i] as configType)?.content?.findIndex(
          (el) => el.type === arr[i].type
        );

        ((arr[i] as configType)?.content[index] as configType).content.every(
          (el) => (el.parentId = arr[i].id)
        );

        (arr[i] as configType)?.content.splice(
          index,
          1,
          ...((arr[i] as configType)?.content[index] as configType).content
        );
      }
    }
  };

  const findParent = function (
    arr: (configType | componentType)[],
    targetElem: componentType
  ): configType | componentType | undefined {
    for (let i of arr) {
      if (i.id === targetElem.parentId) {
        return i;
      }

      if ((i as configType)?.content) {
        const target = findParent((i as configType).content, targetElem);

        if (target) {
          return target;
        }
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

  const findTargetElIndex = function (
    arr: (configType | componentType)[],
    targetElem: componentType
  ): number {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === targetElem.id) {
        return i;
      }

      if ((arr[i] as configType)?.content) {
        const target = findTargetElIndex(
          (arr[i] as configType).content,
          targetElem
        );

        if (target >= 0) {
          return target;
        }
      }
    }

    return -1;
  };

  const insertDraggingEl = (parentElement: configType, targetElem: componentType, landerTarget: string) => {
    const targetElIndex = findTargetElIndex(
      parentElement.content,
      targetElem
    );

    if (
      (parentElement.type === "column" || parentElement.type === "row") &&
      (!targetElem.parentId.includes("row") || !targetElem.parentId.includes("column")) &&
      targetElIndex >= 0
    ) {
      let row: configType | null = null;
      let column: configType | null = null;

      if (landerTarget.includes('col')) {
        row = {
          type: "row",
          id: `row-${rowId + 1}`,
          parentId: targetElem.parentId,
          content: [...landerTarget.includes('right') ? [targetElem, currentEl!] : [currentEl!, targetElem]]
        };

        setRowId(rowId + 1);
      }

      if (landerTarget.includes('row')) {
        column = {
          type: "column",
          id: `column-${columnId + 1}`,
          parentId: targetElem.parentId,
          content: [...landerTarget.includes('bottom') ? [targetElem, currentEl!] : [currentEl!, targetElem]],
        };

        setColumnId(columnId + 1);
      }

      targetElem.parentId = row ? row!.id : column!.id;
      currentEl!.parentId = row ? row!.id : column!.id;

      parentElement.content[targetElIndex] = row ? row! : column!;
    } else {
      let row: configType | null = null;
      let column: configType | null = null;

      if (landerTarget.includes('col')) {
        column = findParent(
          parentElement.content,
          targetElem
        ) as configType;

        if (column) {
          column.content.splice(targetElIndex + (landerTarget.includes('right') ? 1 : 0), 0, currentEl!);
        }
      }

      if (landerTarget.includes('row')) {
        row = findParent(
          parentElement.content,
          targetElem
        ) as configType;

        if (row) {
          row.content.splice(targetElIndex + (landerTarget.includes('bottom') ? 0 : 1), 0, currentEl!);
        }
      }

      if (!column || !row) {
        currentEl!.parentId = targetElem.parentId;
        parentElement.content.splice(targetElIndex + 1, 0, currentEl!);
      }
    }
  }

  const handleDrop = (event: React.DragEvent, targetElem: componentType) => {
    event.preventDefault();

    const element_id = event.dataTransfer.getData("widgetType");
    const element = document.getElementsByClassName(element_id).item(0)!;

    const lander: HTMLElement | null = document.querySelector(".lander");

    if (lander?.id === "right-col") {
      const configCopy = filter(
        JSON.parse(JSON.stringify(config))
      ) as configType[];

      const parentElement = findParent(configCopy, targetElem) as configType;

      if (parentElement) {
        insertDraggingEl(parentElement, targetElem, lander?.id);
      }

      configFilter(configCopy);

      setConfig(configCopy);
    }

    if (lander?.id === "left-col") {
      const configCopy = filter(
        JSON.parse(JSON.stringify(config))
      ) as configType[];

      const parentElement = findParent(configCopy, targetElem) as configType;

      if (parentElement) {
        insertDraggingEl(parentElement, targetElem, lander?.id);
      }

      configFilter(configCopy);

      setConfig(configCopy);
    }

    if (lander?.id === "bottom-row") {
      const configCopy = filter(
        JSON.parse(JSON.stringify(config))
      ) as configType[];

      const parentElement = findParent(configCopy, targetElem) as configType;

      if (parentElement) {
        insertDraggingEl(parentElement, targetElem, lander?.id);
      }

      configFilter(configCopy);

      setConfig(configCopy);
    }

    if (lander?.id === "top-row") {
      const configCopy = filter(
        JSON.parse(JSON.stringify(config))
      ) as configType[];

      const parentElement = findParent(configCopy, targetElem) as configType;

      if (parentElement) {
        insertDraggingEl(parentElement, targetElem, lander?.id);
      }

      configFilter(configCopy);

      setConfig(configCopy);
    }

    element.removeAttribute("style");

    document.querySelector(".manager")?.classList.remove("dragging");

    setDragginEl(null);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();

    const lander: HTMLElement | null = document.querySelector(".lander");

    (draggingEl as HTMLElement).style.top = event.clientY + "px";
    (draggingEl as HTMLElement).style.left = event.clientX + "px";
    (draggingEl as HTMLElement).style.transform = "scale(0.1)";
    (draggingEl as HTMLElement).style.transformOrigin = "0 0";

    const rect = (event.target as HTMLElement).getBoundingClientRect();

    landerRenderer(lander!, event, rect!);
  };

  const handleDragStart = (
    event: React.DragEvent,
    widgetType: string,
    item: componentType
  ) => {
    const parentNode = (event.target as HTMLElement).parentNode as HTMLElement;

    if (parentNode?.childElementCount === 1) {
      setTimeout(() => parentNode.classList.add("zero-dimentions"), 0);
    }

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

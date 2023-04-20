import React, { useRef, useState } from "react";
import { landerRenderer } from "../../utils/helpers/lenderRenderer";
import "./DropBoard.scss";
import { componentType, configType } from "../../utils/types";
import { configFilter } from "../../utils/helpers/configFilter";

export const DropBoard = () => {
  const managerRef = useRef<HTMLDivElement>(null);
  const landerRef = useRef<HTMLDivElement>(null);

  const [draggingEl, setDragginEl] = useState<EventTarget | null>(null);
  const [currentEl, setCurrentEl] = useState<componentType | null>(null);
  const [columnId, setColumnId] = useState<number>(0);
  const [rowId, setRowId] = useState<number>(1);
  const [config, setConfig] = useState<configType[]>([
    {
      type: "stack",
      id: "stack-1",
      parentId: "top-parent",
      content: [
        {
          type: "component",
          componentName: "test_name",
          componentState: { label: "A" },
          id: "1",
          parentId: "stack-1",
          active: true,
        },
        {
          type: "component",
          componentName: "test_name",
          componentState: { label: "B" },
          id: "2",
          parentId: "stack-1",
          active: false,
        },
        {
          type: "component",
          componentName: "test_name",
          componentState: { label: "C" },
          id: "3",
          parentId: "stack-1",
          active: false,
        },
        {
          type: "component",
          componentName: "test_name",
          componentState: { label: "D" },
          id: "4",
          parentId: "stack-1",
          active: false,
        },
      ],
    },
  ]);

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

    const lander: HTMLElement | null = landerRef.current;

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

    managerRef.current?.classList.remove("dragging");

    setDragginEl(null);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();

    const lander: HTMLElement | null = landerRef.current;

    (draggingEl as HTMLElement).style.top = event.clientY + "px";
    (draggingEl as HTMLElement).style.left = event.clientX + "px";

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
    (event.target as HTMLElement).style.top = event.clientY + "px";
    (event.target as HTMLElement).style.left = event.clientX + "px";
    (event.target as HTMLElement).style.maxHeight = 300 + "px";
    (event.target as HTMLElement).style.maxWidth = 300 + "px";

    managerRef.current?.classList.add("dragging");
  };

  const dissablePointerEvents = (event: React.DragEvent) => {
    (event.target as HTMLElement).style.pointerEvents = "none";
  };

  const drowStack = (item: componentType) => {
    return (
      <div
        key={item.id}
        className={`drag-item q${item.id}`}
        draggable={item.parentId.includes('stack')}
        onDragStart={(e) =>
          handleDragStart(e, `drag-item q${item.id}`, item as componentType)
        }
        onDragOver={(e) => handleDragOver(e)}
        onDrag={dissablePointerEvents}
        onDrop={(e) => handleDrop(e, item as componentType)}
      >
        <div
          className={
            "title" + ((item as componentType)?.active ? " active" : "")
          }
        >
          {(item as componentType).componentState.label}
        </div>
      </div>
    );
  };

  const drowElements = (arr: (componentType | configType)[]) => {
    return arr.map((item) => {
      if (item.type === "row" || item.type === "column") {
        return (
          <div key={item.id} className={item.type}>
            {drowElements((item as configType).content)}
          </div>
        );
      }

      if (item.type === "stack") {
        return (
          <div key={item.id} className={item.type}>
            <div className="stack-header">
              {
                (item as configType).content.map(el => drowStack(el as componentType))
              }
            </div>
            <div className="stack-body">
              {
                drowElements((item as configType).content)
              }
            </div>
          </div>
        );
      }

      return (
        <div
          key={item.id}
          className={`drag-item q${item.id + (!(item as componentType)?.active ? ' hidden' : '')}`}
          draggable={!item.parentId.includes('stack')}
          onDragStart={(e) =>
            handleDragStart(e, `drag-item q${item.id}`, item as componentType)
          }
          onDragOver={(e) => handleDragOver(e)}
          onDrag={dissablePointerEvents}
          onDrop={(e) => handleDrop(e, item as componentType)}
        >
        </div>
      );
    });
  };

  return (
    <div className="container">
      <div className="manager" ref={managerRef}>
        {drowElements(config)}
        <div className="lander" ref={landerRef}/>
      </div>
    </div>
  );
};

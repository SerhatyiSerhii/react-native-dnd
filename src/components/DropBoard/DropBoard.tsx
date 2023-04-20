import React, { useRef, useState } from "react";
import { landerRenderer } from "../../utils/helpers/lenderRenderer";
import "./DropBoard.scss";
import { componentType, configType } from "../../utils/types";
import { configFilter } from "../../utils/helpers/configFilter";
import { findParent } from "../../utils/helpers/findParent";
import { filter } from "../../utils/helpers/filter";
import { findTargetElIndex } from "../../utils/helpers/findTargetElIndex";

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

  const insertDraggingEl = (
    parentElement: configType,
    targetElem: componentType,
    landerTarget: string
  ) => {
    const targetElIndex = findTargetElIndex(parentElement.content, targetElem);

    if (
      (parentElement.type === "column" || parentElement.type === "row") &&
      (!targetElem.parentId.includes("row") ||
        !targetElem.parentId.includes("column")) &&
      targetElIndex >= 0
    ) {
      let row: configType | null = null;
      let column: configType | null = null;

      if (landerTarget.includes("col")) {
        row = {
          type: "row",
          id: `row-${rowId + 1}`,
          parentId: targetElem.parentId,
          content: [
            ...(landerTarget.includes("right")
              ? [targetElem, currentEl!]
              : [currentEl!, targetElem]),
          ],
        };

        setRowId(rowId + 1);
      }

      if (landerTarget.includes("row")) {
        column = {
          type: "column",
          id: `column-${columnId + 1}`,
          parentId: targetElem.parentId,
          content: [
            ...(landerTarget.includes("bottom")
              ? [targetElem, currentEl!]
              : [currentEl!, targetElem]),
          ],
        };

        setColumnId(columnId + 1);
      }

      targetElem.parentId = row ? row!.id : column!.id;
      currentEl!.parentId = row ? row!.id : column!.id;

      parentElement.content[targetElIndex] = row ? row! : column!;
    } else {
      let row: configType | null = null;
      let column: configType | null = null;

      if (landerTarget.includes("col")) {
        column = findParent(parentElement.content, targetElem) as configType;

        if (column) {
          column.content.splice(
            targetElIndex + (landerTarget.includes("right") ? 1 : 0),
            0,
            currentEl!
          );
        }
      }

      if (landerTarget.includes("row")) {
        row = findParent(parentElement.content, targetElem) as configType;

        if (row) {
          row.content.splice(
            targetElIndex + (landerTarget.includes("bottom") ? 0 : 1),
            0,
            currentEl!
          );
        }
      }

      if (!column || !row) {
        currentEl!.parentId = targetElem.parentId;
        parentElement.content.splice(targetElIndex + 1, 0, currentEl!);
      }
    }
  };

  const handleDrop = (event: React.DragEvent, targetElem: componentType) => {
    event.preventDefault();

    const element_id = event.dataTransfer.getData("widgetType");
    const element = document.getElementsByClassName(element_id).item(0)!;

    const lander: HTMLElement | null = landerRef.current;

    if (lander?.id === "right-col") {
      const configCopy = filter(
        JSON.parse(JSON.stringify(config)),
        currentEl!
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
        JSON.parse(JSON.stringify(config)),
        currentEl!
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
        JSON.parse(JSON.stringify(config)),
        currentEl!
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
        JSON.parse(JSON.stringify(config)),
        currentEl!
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
    (draggingEl as HTMLElement).classList.remove("dragging");

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
    const targetConfigParent = findParent(config, item);

    if ((targetConfigParent as configType).content.length > 1 && item.active) {
      const parent = document.querySelector(`.${item.parentId}`);

      (
        parent?.lastChild?.childNodes[+item.id - 1] as HTMLElement
      )?.classList.add("hidden");
      (
        parent?.lastChild?.childNodes[+item.id] as HTMLElement
      )?.classList.remove("hidden");
    }

    const parentNode = (event.target as HTMLElement).parentNode as HTMLElement;

    if (parentNode?.childElementCount === 1) {
      setTimeout(() => parentNode.classList.add("zero-dimentions"), 0);
    }

    event.dataTransfer.setData("widgetType", widgetType);
    event.dataTransfer.setDragImage(new Image(), 0, 0);

    setDragginEl(event.target);
    setCurrentEl(JSON.parse(JSON.stringify(item)));

    (event.target as HTMLElement)?.classList.add("dragging");
    (event.target as HTMLElement).style.top = event.clientY + "px";
    (event.target as HTMLElement).style.left = event.clientX + "px";

    managerRef.current?.classList.add("dragging");
  };

  const dissablePointerEvents = (event: React.DragEvent) => {
    (event.target as HTMLElement).style.pointerEvents = "none";
  };

  const setActiveStackLabel = (elConfig: componentType) => {
      const configCopy = JSON.parse(JSON.stringify(config));

      const parent= findParent(configCopy, elConfig);
      const content = (parent as configType)?.content;

      for (let i = 0; i < content?.length; i++) {
        const component = (content[i] as componentType);

        if (component.id === elConfig.id) {
          component.active = true;
        } else {
          component.active = false;
        }
      }

      setConfig(configCopy);
  }

  const drowStack = (item: componentType) => {
    return (
      <div
        key={item.id}
        className={`stack-header-label q${item.id}`}
        draggable={item.parentId.includes("stack")}
        onDragStart={(e) =>
          handleDragStart(
            e,
            `stack-header-label q${item.id}`,
            item as componentType
          )
        }
        onDragOver={(e) => handleDragOver(e)}
        onDrag={dissablePointerEvents}
        onDrop={(e) => handleDrop(e, item as componentType)}
        onClick={() => setActiveStackLabel(item)}
      >
        <div
          className={
            "title" + ((item as componentType)?.active ? " active" : "")
          }
        >
          {(item as componentType).componentState.label}
        </div>

        <div className="dragging-preview">
          <div className="stack-header">
            <div className={`stack-header-label q${item.id}`}>
              <div
                className={
                  "title" + ((item as componentType)?.active ? " active" : "")
                }
              >
                {(item as componentType).componentState.label}
              </div>
            </div>
          </div>
          <div className="stack-body">
            <div className={`stack-body-item q${item.id}`}>Drag preview</div>
          </div>
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
          <div key={item.id} className={`${item.type} ${item.id}`}>
            <div className="stack-header">
              {(item as configType).content.map((el) =>
                drowStack(el as componentType)
              )}
            </div>
            <div className="stack-body">
              {drowElements((item as configType).content)}
            </div>
          </div>
        );
      }

      return (
        <div
          key={item.id}
          className={`stack-body-item q${
            item.id + (!(item as componentType)?.active ? " hidden" : "")
          }`}
          draggable={!item.parentId.includes("stack")}
          onDragStart={(e) =>
            handleDragStart(
              e,
              `stack-body-item q${item.id}`,
              item as componentType
            )
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
      <div className="manager" ref={managerRef}>
        {drowElements(config)}
        <div className="lander" ref={landerRef} />
      </div>
    </div>
  );
};

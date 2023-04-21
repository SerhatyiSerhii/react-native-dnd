import React, { useRef, useState } from "react";
import { configFilter } from "../../utils/helpers/configFilter";
import { countCurStackLength } from "../../utils/helpers/countCurStackLength";
import { filter } from "../../utils/helpers/filter";
import { findParent } from "../../utils/helpers/findParent";
import { landerRenderer } from "../../utils/helpers/lenderRenderer";
import { componentType, configType } from "../../utils/types";
import "./DropBoard.scss";

export const DropBoard = () => {
  const managerRef = useRef<HTMLDivElement>(null);
  const landerRef = useRef<HTMLDivElement>(null);

  const [draggingEl, setDragginEl] = useState<EventTarget | null>(null);
  const [currentEl, setCurrentEl] = useState<componentType | null>(null);
  const [columnId, setColumnId] = useState<number>(0);
  const [rowId, setRowId] = useState<number>(0);
  const [stackId, setStackId] = useState<number>(1);
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
    targetElParent: configType,
    landerTarget: string
  ) => {
    let row: configType | null = null;
    let column: configType | null = null;
    let stack: configType | null = null;
    const parentCopy: configType = JSON.parse(JSON.stringify(targetElParent));

    const newEl: configType = {
      type: landerTarget.includes("col") ? "row": "column",
      id: `${landerTarget.includes("col") ? 'row' : 'column'}-${(landerTarget.includes("col") ? rowId : columnId) + 1}`,
      parentId: targetElParent.parentId,
      content: []
    };

    if (targetElParent.type === "stack" && targetElParent.parentId === 'top-parent') {
      const newElId = `${landerTarget.includes("col") ? 'row' : 'column'}-${(landerTarget.includes("col") ? rowId : columnId) + 1}`

      stack = {
        type: "stack",
        id: `stack-${stackId + 1}`,
        parentId: newElId,
        content: [currentEl!]
      }

      currentEl!.parentId = stack.id;

      newEl.content = [
        ...((landerTarget.includes("right") || landerTarget.includes("bottom"))
        ? [parentCopy, stack]
        : [stack, parentCopy])
      ]

      landerTarget.includes("col") ? row = newEl : column = newEl;

      parentCopy.parentId = landerTarget.includes("col") ? row!.id : column!.id;

      setStackId(stackId + 1);
    } else {
      const draggingElParent = JSON.parse(JSON.stringify(findParent(config, currentEl!)));

      if (countCurStackLength(config, currentEl!) !== 1) {
        stack = {
          type: "stack",
          id: `stack-${stackId + 1}`,
          parentId: targetElParent.parentId,
          content: [currentEl!]
        }

        currentEl!.parentId = stack.id;

        setStackId(stackId + 1);
      }

      newEl.content = [
        ...stack ?
          [...(landerTarget.includes("left") || landerTarget.includes("top")) ? [stack, parentCopy] : [parentCopy, stack]] :
          [...(landerTarget.includes("left") || landerTarget.includes("top")) ? [draggingElParent, parentCopy] : [parentCopy, draggingElParent]]
      ];

      landerTarget.includes("col") ? row = newEl : column = newEl;
    }

    newEl.content.forEach(el => el.parentId = newEl.id);

    landerTarget.includes("col") ? setRowId(rowId + 1) : setColumnId(columnId + 1);

    targetElParent.type = row ? row!.type : column!.type;
    targetElParent.id = row ? row!.id : column!.id;
    targetElParent.parentId = row? row!.parentId : column!.parentId;
    targetElParent.content = row? row!.content : column!.content;
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
        insertDraggingEl(parentElement, lander?.id);
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
        insertDraggingEl(parentElement, lander?.id);
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
        insertDraggingEl(parentElement, lander?.id);
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
        insertDraggingEl(parentElement, lander?.id);
      }

      configFilter(configCopy);

      setConfig(configCopy);
    }

    element.removeAttribute("style");

    managerRef.current?.classList.remove("dragging");
    (draggingEl as HTMLElement).classList.remove("dragging");
    (draggingEl as HTMLElement).closest('.stack')?.classList.remove("zero-dimentions")

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

    if (parentNode.childElementCount === 1) {
      setTimeout(() => parentNode.closest('.stack')?.classList.add("zero-dimentions"), 0);
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

      const toggleActive = function (arr: (configType | componentType)[]) {
        for (let i = 0; i < arr?.length; i++) {
          const componentType = (arr[i] as componentType);
          const configType = (arr[i] as configType);

          if (componentType.id === elConfig.id) {
            componentType.active = true;
          } else {
            componentType.active = false;
          }

          if (configType.content) {
            toggleActive(configType.content);
          }
        }
      }

      toggleActive(configCopy);

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

  const drowElements = (arr: (componentType | configType)[], arrLength: number) => {
    return arr.map((item, index) => {
      if (item.type === "row" || item.type === "column") {
        return (
          <div key={item.id} className={item.type}>
            {drowElements((item as configType).content, (item as configType).content.length)}
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
              {drowElements((item as configType).content, (item as configType).content.length)}
            </div>
          </div>
        );
      }

      return (
        <div
          key={item.id}
          className={`stack-body-item q${
            item.id + (index > 0 && arrLength > 1 ? " hidden" : "")
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
        {drowElements(config, config.length)}
        <div className="lander" ref={landerRef} />
      </div>
    </div>
  );
};

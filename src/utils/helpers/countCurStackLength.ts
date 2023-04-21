import { componentType, configType } from "../types";

export const countCurStackLength = function (
  arr: (configType | componentType)[],
  draggingElement: componentType
) {
  let length = 0;

  for (let i = 0; i < arr.length; i++) {
    if (
      (arr[i] as configType)?.content &&
      (arr[i] as configType)?.content.some((el) => el.type !== "component")
    ) {
      const result = countCurStackLength((arr[i] as configType)?.content, draggingElement);

      if (result) {
        length = result;
        break;
      }
    } else {
      if (
        (arr[i] as configType)?.content.some((el) => el.id === draggingElement!.id)
      ) {
        length = (arr[i] as configType)?.content.length;
        break;
      }
    }
  }

  return length;
};

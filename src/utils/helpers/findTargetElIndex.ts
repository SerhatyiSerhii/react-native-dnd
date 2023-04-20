import { componentType, configType } from "../types";

export const findTargetElIndex = function (
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

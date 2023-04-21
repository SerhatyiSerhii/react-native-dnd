import { componentType, configType } from "../types";

export const findParent = function (
  arr: (configType | componentType)[],
  targetElem: configType | componentType
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

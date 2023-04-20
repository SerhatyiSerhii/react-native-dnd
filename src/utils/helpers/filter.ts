import { componentType, configType } from "../types";

export const filter = function (
  arr: (configType | componentType)[],
  targetEl: componentType
) {
  return arr.filter((item) => {
    if ((item as configType).content) {
      (item as configType).content = filter(
        (item as configType).content,
        targetEl
      );
    }

    return item.id !== targetEl?.id;
  });
};

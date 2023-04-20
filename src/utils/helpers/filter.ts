import { componentType, configType } from "../types";

export const filter = function (
  arr: (configType | componentType)[],
  targetEl: componentType
) {
  return arr.filter((item) => {
    const configItem = item as configType;

    if (configItem.content) {
      configItem.content = filter(
        configItem.content,
        targetEl
      );
    }

    return item.id !== targetEl?.id;
  });
};

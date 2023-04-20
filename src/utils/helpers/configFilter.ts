import { componentType, configType } from "../types";

export const configFilter = function (arr: (configType | componentType)[]) {
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
        const content = (arr[i] as configType)?.content;

        for (let j = 0; j < content.length; j ++) {
          if (content[j].type === arr[i].type) {

            (content[j] as configType).content.every(
              (el) => (el.parentId = arr[i].id)
            );

            content.splice(
              j,
              1,
              ...(content[j] as configType).content
            );

            j--;
          }
        }
      }
    }
  };
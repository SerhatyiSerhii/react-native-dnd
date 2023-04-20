export type configType = {
  type: string;
  id: string;
  parentId: string;
  content: (configType | componentType)[];
};

export type componentType = {
  type: string;
  componentName: string;
  componentState: { label: string };
  id: string;
  parentId: string;
  active: boolean;
};

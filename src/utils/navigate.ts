// src/utils/navigate.ts
let navigator: (path: string) => void;

export const setNavigator = (nav: (path: string) => void) => {
  navigator = nav;
};

export const navigate = (path: string) => {
  if (navigator) navigator(path);
};

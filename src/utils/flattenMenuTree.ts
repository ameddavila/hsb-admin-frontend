// src/utils/flattenMenuTree.ts
// src/utils/flattenMenuTree.ts

type MenuItem = {
  path: string;
  permission?: string | null;
  children?: MenuItem[];
};

export function flattenMenuTree(menus: MenuItem[]): MenuItem[] {
  const flat: MenuItem[] = [];
  const visited = new Set<string>();

  const recurse = (items: MenuItem[]) => {
    for (const item of items) {
      if (!visited.has(item.path)) {
        visited.add(item.path);
        flat.push(item);
      }
      if (item.children?.length) {
        recurse(item.children);
      }
    }
  };

  recurse(menus);
  return flat;
}

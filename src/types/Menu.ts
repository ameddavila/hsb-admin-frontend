export interface MenuNode {
  id: number;
  name: string;
  path: string;
  icon: string;
  group?: string;
  parentId: number | null;
  isActive: boolean;
  sortOrder: number;
  permission: string | null;
  createdAt?: string;
  updatedAt?: string;
  children: MenuNode[];
}

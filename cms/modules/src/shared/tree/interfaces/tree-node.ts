export class TreeNode {
  id: string;
  parentId: string;
  name: string;
  icon: string;
  url: string;

  isNeedToScroll: boolean = false;
  isExpanded: boolean = false;;
  isSelected: boolean = false;
  isEditing: boolean = false;
  isLoading: boolean = false;
  isNew: boolean = false;

  hasChildren: boolean = false;
  parentPath: string;
  [propName: string]: any;

  public constructor(init?: Partial<TreeNode>) {
    Object.assign(this, init);
  }

  expand() {
    this.isExpanded = !this.isExpanded;
  }
}
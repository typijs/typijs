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
  //variable to store extend data ex content type, published or not... depend on type of tree
  extendProperties: any = {};

  public constructor(init?: Partial<TreeNode>) {
    Object.assign(this, init);
  }

  expand() {
    this.isExpanded = !this.isExpanded;
  }
}
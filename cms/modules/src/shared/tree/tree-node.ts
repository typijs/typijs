export class TreeNode {
  id: string;
  parentId: string;
  name: string;
  icon: string;
  url: string;

  isExpanded: boolean = false;;
  isSelected: boolean = false;
  isEditing: boolean = false;
  isLoading: boolean = false;

  hasChildren: boolean = false;
  parentPath: string;
  //variable to store extend data ex content type, published or not... depend on type of tree
  extendData: any = {};

  public constructor(init?: Partial<TreeNode>) {
    Object.assign(this, init);
  }

  expand() {
    this.isExpanded = !this.isExpanded;
  }
}
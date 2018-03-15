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
  //variable to store extend data ex content type, published or not... depend on type of tree
  extendData: any = {};

  constructor(id, name: string, hasChildren?: boolean) {
    this.id = id;
    this.name = name;
    this.hasChildren = hasChildren ? hasChildren : false;
  }

  expand() {
    this.isExpanded = !this.isExpanded;
  }
}
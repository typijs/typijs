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
  hasChildren: boolean = true;

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  expand() {
    this.isExpanded = !this.isExpanded;
  }
}
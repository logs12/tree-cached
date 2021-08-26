import { v4 as uuidv4 } from "uuid";
import { Type, classToClass } from "class-transformer";

export class TreeNode<T> {
  value: T;
  parentId: string = "";

  @Type(() => TreeNode)
  children: Array<TreeNode<T>> = [];

  isDelete: boolean = false;
  isNew: boolean = false;
  id: string = "";

  constructor(value: T) {
    this.value = value;
    this.id = uuidv4();
  }

  setValue(value: T) {
    this.value = value;
  }

  setParent(parentId: string) {
    this.parentId = parentId;
  }

  setChildren(child: TreeNode<T>) {
    this.children.push(child);
  }

  clearChildren() {
    this.children.length = 0;
  }

  setId(id: string) {
    this.id = id;
  }

  markAsNew() {
    this.isNew = true;
  }

  markAsOld() {
    this.isNew = true;
  }

  markAsDelete() {
    this.isDelete = true;
  }
}

export class Tree<T> {
  @Type(() => TreeNode)
  root: TreeNode<T>;

  constructor(value: T) {
    this.root = new TreeNode(value);
  }

  traverse(callback: (...args: any[]) => void) {
    const recurse = (currentNode: TreeNode<T>) => {
      for (let i = 0; i < currentNode.children.length; i++) {
        recurse(currentNode.children[i]);
      }
      callback(currentNode);
    };
    if (this.root) {
      recurse(this.root);
    }
  }

  editValueChildNode(value: T, nodeId: string): void {
    this.traverse((node: TreeNode<T>) => {
      if (node.id === nodeId) {
        node.setValue(value);
      }
    });
  }

  addNewChildNode(
    value: T,
    parentId: string,
    isMarkAsNew: boolean = false
  ): void {
    const child: TreeNode<T> = new TreeNode(value);
    if (isMarkAsNew) {
      child.markAsNew();
    }
    let parent: any = null;
    this.traverse((node: TreeNode<T>) => {
      if (node.id === parentId) {
        parent = node;
      }
    });

    if (parent != null) {
      parent.children.push(child);
      child.setParent(parentId);
    } else {
      this.root.children.push(child);
    }
  }

  remove(nodeId: string): void | never {
    this.traverse((node: TreeNode<T>) => {
      if (node.id === nodeId) {
        node.markAsDelete();
        if (node.children.length) {
          node.children.forEach((child: TreeNode<T>) => {
            child.markAsDelete();
          });
        }
      }
    });
  }

  findNodeById(nodeId: string): TreeNode<T> | null {
    let result = null;
    this.traverse((node: TreeNode<T>) => {
      if (node.id === nodeId) {
        result = classToClass(node);
      }
    });
    return result;
  }

  isChildAlreadyAdded(nodeId: string): boolean {
    let result = false;
    this.traverse((node: TreeNode<T>) => {
      if (node.id === nodeId) {
        result = true;
      }
    });
    return result;
  }

  createTreeFromList(treeList: Array<TreeNode<T>>) {
    treeList.forEach((newNode: TreeNode<T>) => {
      if (!newNode.isNew) {
        this.traverse((node: TreeNode<T>) => {
          if (node.id === newNode.id) {
            node.setValue(newNode.value);
            node.setParent(newNode.parentId);
            if (newNode.isDelete) {
              node.markAsDelete();
            }
          }
        });
      } else {
        this.addNewChildNode(newNode.value, newNode.parentId);
      }
    });
  }
}

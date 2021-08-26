import { v4 as uuidv4 } from "uuid";
import cloneDeep from "lodash/cloneDeep";
import { Type } from "class-transformer";

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
      if (parent.isDelete) {
        child.markAsDelete();
      }
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
            this.remove(child.id);
          });
        }
      }
    });
  }

  findNodeById(nodeId: string): TreeNode<T> | null {
    let result = null;
    this.traverse((node: TreeNode<T>) => {
      if (node.id === nodeId) {
        result = node;
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

  clone() {
    return cloneDeep(this);
  }
}

export class CachedTree<T> extends Tree<T> {
  addChildNode(newNode: TreeNode<T>): void {
    // if the node has already been added then do nothing
    if (this.isChildAlreadyAdded(newNode.id)) {
      return;
    }

    let parent: any = null;

    // looking for parent nodes
    this.traverse((node: TreeNode<T>) => {
      if (node.id === newNode.parentId) {
        parent = node;
      }
    });

    if (parent != null) {
      // if the parent is removed, delete the child
      if (parent.isDelete) {
        newNode.markAsDelete();
      }
      // select node with other Children
      let nodeWithOtherChildren: any = null;
      this.traverse((node: TreeNode<T>) => {
        if (node.children.some((child) => child.parentId === newNode.id)) {
          nodeWithOtherChildren = node;
        }
      });
      if (nodeWithOtherChildren) {
        newNode.children = nodeWithOtherChildren.children.filter(
          (child: TreeNode<T>) => child.parentId === newNode.id
        );
        nodeWithOtherChildren.children = nodeWithOtherChildren.children.filter(
          (child: TreeNode<T>) => child.parentId !== newNode.id
        );
      }
      parent.children.push(newNode);
    } else {
      let children: Array<TreeNode<T>> = [];

      // collecting child nodes for the node you want to add
      this.traverse((node: TreeNode<T>) => {
        if (node.parentId === newNode.id) {
          children.push(node);
        }
      });
      // filtering child nodes of the tree from repetitions
      children.forEach((newChild) => {
        this.traverse((node: TreeNode<T>) => {
          node.children = node.children.filter(
            (nodeChild) => nodeChild.id !== newChild.id
          );
        });
      });
      newNode.children = children;
      this.root.children.push(newNode);
    }
  }
}

import { TreeNode } from "./Tree";

export const convertTreeToList = (tree: TreeNode<string>[]) => {
  return tree.reduce(function (acc: any, node: TreeNode<string>) {
    acc.push({
      id: node.id,
      isDelete: node.isDelete,
      parentId: node.parentId,
      isNew: node.isNew,
      value: node.value
    });
    if (node.children.length) {
      acc = acc.concat(convertTreeToList(node.children));
    }
    return acc;
  }, []);
};

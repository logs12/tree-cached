import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { Tree, TreeNode } from "../models/Tree";
import * as initTree from "../seeds/initTree.json";

let tree = initTree;

export const getData = (req: Request, res: Response) => {
  try {
    res.send(tree);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

export const getNode = (req: Request, res: Response) => {
  try {
    const treeData = plainToClass(Tree, tree);
    const cachedNode = treeData.getNodeByIdWithoutChildren(req.params.id);
    res.send(cachedNode);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

export const postData = (req: Request, res: Response) => {
  try {
    const nodeList = req.body;
    const treeData = plainToClass(Tree, tree);
    treeData.createTreeFromList(req.body);

    tree = treeData;
    const newNodeList = nodeList.reduce((acc: any, node: TreeNode<string>) => {
      const resultNode = treeData.findNodeById(node.id);
      if (resultNode) {
        acc.push({
          id: resultNode.id,
          isDelete: resultNode.isDelete,
          parentId: resultNode.parentId,
          isNew: resultNode.isNew,
          value: resultNode.value
        });
      }

      return acc;
    }, []);
    res.send({ tree, newCachedNodeList: newNodeList });
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

export const getInitData = (req: Request, res: Response) => {
  try {
    tree = initTree;
    res.send(initTree);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

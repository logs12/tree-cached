import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { Tree } from "../models/Tree";
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
    const treeData = plainToClass(Tree, tree);
    treeData.createTreeFromList(req.body);
    tree = treeData;
    res.send(tree);
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

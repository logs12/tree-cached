import React from "react";
import cn from "classnames";
import TreeItem from "@material-ui/lab/TreeItem";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import { TreeView as TreeViewMaterial } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { Tree, TreeNode } from "./Tree";

const useTreeItemStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: 516,
      flexGrow: 1,
      maxWidth: 700
    },
    labelRoot: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0.5, 0)
    },
    labelAsDeleted: {
      backgroundColor: red["A100"]
    }
  })
);

const RenderTree = ({
  treeNode,
  classNameLabelRoot,
  classNameLabelAsDeleted
}: {
  treeNode: TreeNode<string> | null;
  classNameLabelRoot: string;
  classNameLabelAsDeleted: string;
}) => {
  if (!treeNode) return treeNode;
  return (
    <TreeItem
      key={treeNode.id}
      nodeId={`${treeNode.id}`}
      label={
        <div
          className={cn(
            classNameLabelRoot,
            treeNode.isDelete && classNameLabelAsDeleted
          )}
        >
          {treeNode.value}
        </div>
      }
    >
      {Array.isArray(treeNode.children)
        ? treeNode.children.map((node, item) => (
            <RenderTree
              key={item}
              treeNode={node}
              classNameLabelRoot={classNameLabelRoot}
              classNameLabelAsDeleted={classNameLabelAsDeleted}
            />
          ))
        : null}
    </TreeItem>
  );
};

export const TreeView = ({
  tree,
  selected,
  onSelect
}: {
  tree: Tree<string> | null;
  selected: string;
  onSelect: (nodeId: string) => void;
}) => {
  const classes = useTreeItemStyles();
  const handleSelect = (event: React.ChangeEvent<{}>, nodeId: string) => {
    console.log("nodeIds = ", nodeId);
    onSelect(nodeId);
  };
  return (
    <TreeViewMaterial
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      selected={selected}
      onNodeSelect={handleSelect}
    >
      {tree && (
        <RenderTree
          treeNode={tree.root}
          classNameLabelRoot={classes.labelRoot}
          classNameLabelAsDeleted={classes.labelAsDeleted}
        />
      )}
    </TreeViewMaterial>
  );
};

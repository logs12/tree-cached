import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { Tree } from "./Tree";
import { TreeView } from "./TreeView";

const useStyles = makeStyles({
  root: {
    minHeight: 516,
    flexGrow: 1,
    maxWidth: 700
  }
});

export const DBTreeView = ({
  onSelectedNode,
  selectedNode,
  tree
}: {
  tree: Tree<string> | null;
  selectedNode: string;
  onSelectedNode: (nodeId: string) => void;
}) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <TreeView
          tree={tree}
          selected={selectedNode}
          onSelect={onSelectedNode}
        />
      </CardContent>
    </Card>
  );
};

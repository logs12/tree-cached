import React, { useEffect, useState } from "react";
import { plainToClass } from "class-transformer";

import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import { LinearProgress } from "@material-ui/core";
import { CachedTree, Tree, TreeNode } from "./Tree";
import { CachedTreeView } from "./CachedTreeView";
import { DBTreeView } from "./DBTreeView";
import { getTree, getInitTree, addTree, getNode } from "../../api/";
import { convertTreeToList } from "./utlis";

const useStyles = makeStyles({
  root: {
    minHeight: 516,
    flexGrow: 1,
    maxWidth: 700
  },
  app: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100%"
  },
  arrowBackButton: {
    margin: "0 50px"
  },
  treeViewContainer: {
    display: "flex"
  },
  downBar: {
    display: "flex"
  },
  downBarButton: {
    marginRight: "20px"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  loadingContainer: {
    position: "fixed",
    width: "100%",
    height: "100%"
  }
});

function TreePanel() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDbNodeTree, setSelectedDbNodeTree] = useState<string>("");
  const [selectedIdCachedNodeTree, setSelectedIdCachedNodeTree] =
    useState<string>("");
  const [cachedTree, setCachedTree] = useState<{
    tree: CachedTree<string>;
  }>({
    tree: new CachedTree("root")
  });
  const [dbTree, setDbTree] = useState<Tree<string> | null>(null);

  const handleGetTree = async () => {
    setIsLoading(true);
    const result = await getTree();
    if (result.status === 200) {
      const tree = plainToClass(Tree, result.data);
      if (tree) {
        setDbTree(tree);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetTree();
  }, []);

  const handleCachedNode = async () => {
    if (selectedDbNodeTree) {
      setIsLoading(true);
      const result = await getNode(selectedDbNodeTree);
      if (result.status === 200) {
        let tree = cachedTree.tree;
        tree.addChildNode(plainToClass(TreeNode, result.data));
        setCachedTree({ tree });
      }
      setIsLoading(false);
    }
  };

  const handleCachedRemoveNode = () => {
    if (cachedTree.tree) {
      const newCachedTree = cachedTree.tree.clone();
      newCachedTree.remove(selectedIdCachedNodeTree);
      setCachedTree({ tree: newCachedTree });
    }
  };

  const handleApply = async () => {
    setIsLoading(true);
    if (cachedTree.tree) {
      const result = await addTree(
        convertTreeToList(cachedTree.tree.root.children)
      );
      if (result.status === 200) {
        const tree = plainToClass(Tree, result.data);
        if (tree) {
          setDbTree(tree);
        }
      }
    }
    setIsLoading(false);
  };

  const handleReset = async () => {
    setIsLoading(true);
    const result = await getInitTree();
    if (result.status === 200) {
      const tree = plainToClass(Tree, result.data);
      if (tree) {
        setDbTree(tree);
        setSelectedDbNodeTree("");
        setSelectedIdCachedNodeTree("");
        setCachedTree({ tree: new CachedTree("root") });
      }
    }
    setIsLoading(false);
  };

  return (
    <div className={classes.app}>
      {isLoading && (
        <div className={classes.loadingContainer}>
          <LinearProgress />
        </div>
      )}
      <div className={classes.treeViewContainer}>
        <CachedTreeView
          tree={cachedTree.tree}
          selectedNodeId={selectedIdCachedNodeTree}
          onSelectedNodeId={setSelectedIdCachedNodeTree}
          onRemove={handleCachedRemoveNode}
          onReset={handleReset}
          onApply={handleApply}
        />
        <div className={classes.buttonContainer}>
          <IconButton
            onClick={handleCachedNode}
            aria-label="delete"
            className={classes.arrowBackButton}
            size="small"
          >
            <ArrowBackIos fontSize="inherit" />
          </IconButton>
        </div>

        <DBTreeView
          tree={dbTree}
          onSelectedNode={setSelectedDbNodeTree}
          selectedNode={selectedDbNodeTree}
        />
      </div>
    </div>
  );
}

export default TreePanel;

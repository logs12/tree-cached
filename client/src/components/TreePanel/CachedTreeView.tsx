import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import Edit from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

import { Tree } from "./Tree";
import { TreeView } from "./TreeView";
import AddOrEditNode from "./AddOrEditNode";

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
  downBar: {
    display: "flex"
  },
  downBarButton: {
    marginRight: "20px"
  }
});

interface IState {
  dialog: {
    isOpen: boolean;
    type: DialogType | null;
  };
}

const initialState = {
  dialog: {
    isOpen: false,
    type: null
  }
};

enum DialogType {
  add = "add",
  edit = "edit"
}

enum ActionType {
  openDialog = "openDialog",
  closeDialog = "closeDialog"
}

type Action<T> = { type: string; payload?: T };

function reducer(state: IState, action: Action<DialogType | null>): IState {
  switch (action.type) {
    case ActionType.openDialog:
      return {
        dialog: {
          isOpen: true,
          type: action.payload ? action.payload : initialState.dialog.type
        }
      };
    case ActionType.closeDialog:
      return initialState;
    default:
      throw new Error();
  }
}

export const CachedTreeView = ({
  tree,
  selectedNodeId,
  onSelectedNodeId,
  onRemove,
  onReset,
  onApply
}: {
  tree: Tree<string> | null;
  selectedNodeId: string;
  onSelectedNodeId: (nodeId: string) => void;
  onRemove: () => void;
  onReset: () => void;
  onApply: () => void;
}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const classes = useStyles();
  const handleOpenAddNodeDialog = () => {
    handleClickOpen(DialogType.add);
  };
  const handleOpenEditNodeDialog = () => {
    handleClickOpen(DialogType.edit);
  };

  const handleClickOpen = (dialogType: DialogType) => {
    dispatch({
      type: ActionType.openDialog,
      payload: dialogType
    });
  };

  const handleCloseDialog = () => {
    dispatch({
      type: ActionType.closeDialog,
      payload: null
    });
  };

  const selectedNode = React.useMemo(
    () => tree?.findNodeById(selectedNodeId),
    [tree, selectedNodeId]
  );

  const handleAddNode = (value: string) => {
    tree?.addNewChildNode(value, selectedNodeId, true);
  };

  const handleEditValueNode = (value: string) => {
    tree?.editValueChildNode(value, selectedNodeId);
  };

  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <TreeView
            tree={tree}
            selected={selectedNodeId}
            onSelect={onSelectedNodeId}
          />
        </CardContent>
        <CardActions>
          <IconButton
            onClick={handleOpenAddNodeDialog}
            aria-label="add"
            className={classes.downBarButton}
            size="small"
            disabled={!selectedNodeId || selectedNode?.isDelete}
          >
            <Add fontSize="inherit" />
          </IconButton>
          <IconButton
            onClick={onRemove}
            aria-label="remove"
            className={classes.downBarButton}
            size="small"
            disabled={!selectedNodeId}
          >
            <Remove fontSize="inherit" />
          </IconButton>
          <IconButton
            onClick={handleOpenEditNodeDialog}
            aria-label="edit"
            className={classes.downBarButton}
            size="small"
            disabled={!selectedNodeId || selectedNode?.isDelete}
          >
            <Edit fontSize="inherit" />
          </IconButton>

          <Button onClick={onApply} disabled={!tree}>
            Apply
          </Button>
          <Button onClick={onReset}>Reset</Button>
        </CardActions>
      </Card>
      <AddOrEditNode
        isEdit={state.dialog.type === DialogType.edit}
        open={state.dialog.isOpen}
        onClose={handleCloseDialog}
        nodeValue={selectedNode ? selectedNode.value : ""}
        onSubmit={
          state.dialog.type === DialogType.add
            ? handleAddNode
            : handleEditValueNode
        }
      />
    </>
  );
};

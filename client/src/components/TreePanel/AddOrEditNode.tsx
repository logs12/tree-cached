import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useEffect } from "react";

export default function FormDialog({
  open,
  isEdit,
  nodeValue = "",
  onClose,
  onSubmit
}: {
  open: boolean;
  isEdit: boolean;
  nodeValue?: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = React.useState<string>(nodeValue);

  useEffect(() => {
    setValue(nodeValue);
  }, [nodeValue]);

  const handleOk = () => {
    onClose();
    onSubmit(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {isEdit ? "Edit node" : "Add node"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Node name"
            value={value}
            onChange={handleChange}
            type="nodeValue"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOk} color="primary">
            {isEdit ? "Edit  " : "Add  "}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

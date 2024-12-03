// Importing necessary Material UI components and hooks
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

// Defining the ConfirmDialog component, which receives props for managing dialog visibility and actions
export default function ConfirmDialog({
  open, // Controls whether the dialog is open or closed
  setConfirmOpen, // Function to set the open state of the dialog
  onConfirm, // Function to execute the confirmation action
}) {
  // Function to handle closing the dialog
  const handleCloseConfirmDialog = () => {
    setConfirmOpen(false); // Closes the dialog
  };

  return (
    // Dialog component for confirmation
    <Dialog open={open} onClose={handleCloseConfirmDialog}>
      <DialogTitle>{"Are you sure you want to perform this action?"}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">This action cannot be undone.</Typography>
      </DialogContent>

      <DialogActions>
        <Button color="secondary" onClick={handleCloseConfirmDialog}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => {
            onConfirm(); // Executes the confirm action
            handleCloseConfirmDialog(); // Closes the dialog
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

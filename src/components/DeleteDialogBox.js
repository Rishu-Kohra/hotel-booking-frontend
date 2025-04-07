import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';

function DeleteDialogBox({open, onClose, handleDeleteAccount}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete your account?"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                This action cannot be undone. Please confirm if you want to delete your account.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={onClose} color="primary">
                Cancel
            </Button>
            <Button onClick={()=>handleDeleteAccount()} color="error" autoFocus> Delete </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteDialogBox;
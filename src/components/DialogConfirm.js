import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from '@mui/material';
import { inventory } from '../services/api'; 


export default function DialogConfirm({ roomTypeId, open, onClose, message, description }) {

    const handleAdd = async () => {
        try{
            await inventory.intializeInventory(roomTypeId);
            onClose(); 
        } catch(err) {
            console.log("Cant add inventory")
        }
    }
    
    return (
        <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        BackdropProps={{
            style: { backgroundColor: 'transparent'},
          }}
          PaperProps={{
            elevation: 5,
          }}
       >
        <DialogTitle id="alert-dialog-title">{message}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
                Cancel
            </Button>
          <Button onClick={()=>handleAdd()} color="inherit"> Add </Button>
          </DialogActions>
      </Dialog>
    )
}



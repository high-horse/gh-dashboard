import  React, { createContext, useContext, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const ConfirmContext = createContext();

export function UseConfirmUI({children}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState({
        title: "",
        message: "",
        okText: 'Ok',
        cancelText: 'Cancel',
        enableCancel: true,
        onOk: null,
        onCancel: null,
        persistant: true,
    })

    const showConfirmDialog = () => setIsDialogOpen(true);;
    const hideConfirmDialog = () => setIsDialogOpen(false);;


    function showDialog (
        {
            title = "Confirm",
            message = "Are you sure?",
            okText = "Ok",
            cancelText = "Cancel",
            enableCancel = true,
            onOk = null,
            onCancel = null,
            persistant = true,
        } = {} 
    ) {

        setDialogContent({
            title,
            message,
            okText,
            cancelText,
            enableCancel,
            onOk,
            onCancel,
            persistant,
        });
        setIsDialogOpen(true);
    } 
    
    const handleCancel = (e) => {
        e.stopPropagation();
        e.preventDefault();
        dialogContent.onCancel?.();
        hideConfirmDialog();
    } 

    const handleOk = (e) =>{
        e.stopPropagation();
        e.preventDefault();
        dialogContent.onOk?.();
        hideConfirmDialog();
    }

    return (
        <ConfirmContext.Provider value={{showDialog, hideConfirmDialog}}>
            {children}
            <Dialog
                open={isDialogOpen}
                onClose={!dialogContent.persistant ? hideConfirmDialog : undefined}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                slotProps={{
                    paper: {
                        sx: {
                            minWidth: 360,
                            maxWidth: 500,
                            width: '90%', 
                        },
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title"> {dialogContent.title} </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description"> {dialogContent.message} </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {dialogContent.enableCancel && (
                        <Button onClick={handleCancel}>{dialogContent.cancelText}</Button>
                    )}

                    <Button onClick={handleOk} autoFocus>
                        {dialogContent.okText}
                    </Button>
                </DialogActions>
            </Dialog>
        </ConfirmContext.Provider>
    )
}


export function useConfirmDialog() {
    return useContext(ConfirmContext)

}
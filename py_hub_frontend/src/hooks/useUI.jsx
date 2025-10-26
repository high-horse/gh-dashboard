import React, {createContext, useState, useContext} from "react";
import { Backdrop, CircularProgress, Snackbar, Alert } from "@mui/material";

const UIContext = createContext();

export function UIProvider({children}) {
    const [loading, setLoading] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info", // success | error | warning | info
    });

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    const showSnackbar = (message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    }

    return (
        <UIContext.Provider value={{showLoader, hideLoader, showSnackbar}}>
            {children}

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer +999 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    security={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </UIContext.Provider>
        
    );
}

export function useUI() {
    return useContext(UIContext);
}
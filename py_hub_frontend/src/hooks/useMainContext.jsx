import React, { createContext, useContext } from "react";
import { UIProvider } from "@hooks/useUI";
import { UseConfirmUI } from "@hooks/useConfirmDialog";
import { AuthProvider } from "@hooks/useAuth";


const MainContext = createContext();

export function MainProvider({children}) {

    return(
        <MainContext.Provider value={{}}>
            <AuthProvider>
            <UIProvider>
                <UseConfirmUI>
                        {children}
                    </UseConfirmUI>
                </UIProvider>
            </AuthProvider>
        </MainContext.Provider>
    );
}

export function useMainContext() {
    return useContext(MainContext)
}
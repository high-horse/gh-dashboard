import { useEffect, useState, useContext, createContext } from "react";
import api from "@api/axiox";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        loading: true, authenticated: false, user: null
    });

    useEffect(() => {
        // Correct pattern for async calls inside useEffect
        async function fetchAuth() {
            try {
                const response = await api.get("auth/me");
                setAuth({ loading: false, authenticated: true, user: response.data.user });
            } catch (error) {
                console.error("error ", error);

                setAuth({ loading: false, authenticated: false, user: null });
            }
        }
        fetchAuth();
    }, []);

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;

}


export function useAuth() {
    return useContext(AuthContext);
}
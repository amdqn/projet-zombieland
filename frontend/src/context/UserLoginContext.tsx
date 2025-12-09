import {createContext, type Dispatch, type ReactNode, type SetStateAction, useEffect, useState} from "react";

// Gère l'état global de l'authentification de l'application
// Il permet de partager les informations de connexion (statut, rôle, nom d'utilisateur)
interface LoginProviderProps {
    children: ReactNode;
}

interface ILoginUSer {
    isLogged: boolean;
    setIsLogged: Dispatch<SetStateAction<boolean>>;
    role: "CLIENT" | "ADMIN" | null;
    setRole: Dispatch<SetStateAction<"CLIENT" | "ADMIN" | null>>;
    pseudo: string,
    setPseudo: React.Dispatch<React.SetStateAction<string>>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    logout: () => void;
}

export const LoginContext = createContext<ILoginUSer>({
    isLogged: false,
    setIsLogged: () => {},
    role: null,
    setRole: () => {},
    pseudo: "",
    setPseudo: () => {},
    token: null,
    setToken: () => {},
    logout: () => {}
})

export function LoginProvider({ children }: LoginProviderProps) {
    const [isLogged, setIsLogged] = useState(false);
    const [role, setRole] = useState<"CLIENT" | "ADMIN" | null>(null);
    const [pseudo, setPseudo] = useState("");
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedRole = localStorage.getItem("role") as "CLIENT" | "ADMIN" | null;
        const savedPseudo = localStorage.getItem("pseudo");

        if (savedToken && savedRole && savedPseudo) {
            setToken(savedToken);
            setRole(savedRole);
            setPseudo(savedPseudo);
            setIsLogged(true);
        }
    }, []);

    const logout = () => {
        setIsLogged(false);
        setRole(null);
        setPseudo("");
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("pseudo");
    };

    return (
        <LoginContext.Provider value={{
            isLogged,
            setIsLogged,
            role,
            setRole,
            pseudo,
            setPseudo,
            token,
            setToken,
            logout
        }}>
            {children}
        </LoginContext.Provider>
    )
}
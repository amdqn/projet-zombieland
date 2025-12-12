import {createContext, type Dispatch, type ReactNode, type SetStateAction, useState} from "react";

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
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    logout: () => void;
    isLoading: boolean;
}

export const LoginContext = createContext<ILoginUSer>({
    isLogged: false,
    setIsLogged: () => {},
    role: null,
    setRole: () => {},
    pseudo: "",
    setPseudo: () => {},
    email: "",
    setEmail: () => {},
    token: null,
    setToken: () => {},
    logout: () => {},
    isLoading: true
})

export function LoginProvider({ children }: LoginProviderProps) {
    // Initialisation depuis localStorage pour éviter un flash de redirection
    const [isLogged, setIsLogged] = useState(() => {
        const savedToken = localStorage.getItem("token");
        const savedRole = localStorage.getItem("role");
        const savedPseudo = localStorage.getItem("pseudo");
        return !!(savedToken && savedRole && savedPseudo);
    });
    const [role, setRole] = useState<"CLIENT" | "ADMIN" | null>(() => {
        return localStorage.getItem("role") as "CLIENT" | "ADMIN" | null;
    });
    const [pseudo, setPseudo] = useState(() => {
        return localStorage.getItem("pseudo") || "";
    });
    const [email, setEmail] = useState(() => {
        return localStorage.getItem("email") || "";
    });
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("token");
    });
    const [isLoading, setIsLoading] = useState(false);

    const logout = () => {
        setIsLogged(false);
        setRole(null);
        setPseudo("");
        setEmail("");
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("pseudo");
        localStorage.removeItem("email");
    };

    return (
        <LoginContext.Provider value={{
            isLogged,
            setIsLogged,
            role,
            setRole,
            pseudo,
            setPseudo,
            email,
            setEmail,
            token,
            setToken,
            logout,
            isLoading
        }}>
            {children}
        </LoginContext.Provider>
    )
}
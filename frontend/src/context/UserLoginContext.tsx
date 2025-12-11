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
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
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
    email: "",
    setEmail: () => {},
    token: null,
    setToken: () => {},
    logout: () => {}
})

export function LoginProvider({ children }: LoginProviderProps) {
    const [isLogged, setIsLogged] = useState(false);
    const [role, setRole] = useState<"CLIENT" | "ADMIN" | null>(null);
    const [pseudo, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedRole = localStorage.getItem("role") as "CLIENT" | "ADMIN" | null;
        const savedPseudo = localStorage.getItem("pseudo");
        const savedEmail = localStorage.getItem("email");

        if (savedToken && savedRole && savedPseudo) {
            setToken(savedToken);
            setRole(savedRole);
            setPseudo(savedPseudo);
            if (savedEmail) setEmail(savedEmail);
            setIsLogged(true);
        }
    }, []);

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
            logout
        }}>
            {children}
        </LoginContext.Provider>
    )
}
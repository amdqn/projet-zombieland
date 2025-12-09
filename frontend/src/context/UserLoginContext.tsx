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
}

export const LoginContext = createContext<ILoginUSer>({
    isLogged: false,
    setIsLogged: () => {},
    role: null,
    setRole: () => {},
    pseudo: "",
    setPseudo: () => {}
})

export function LoginProvider({ children } : LoginProviderProps){
    const [isLogged, setIsLogged] = useState(false);
    const [role, setRole] = useState<"CLIENT" | "ADMIN" | null>(null);
    const [pseudo, setPseudo] = useState("")
    return (
        <LoginContext.Provider value={{isLogged, setIsLogged, role, setRole, pseudo, setPseudo}}>
            {children}
        </LoginContext.Provider>
    )
}
import {createContext, type Dispatch, type ReactNode, type SetStateAction, useState, useEffect} from "react";

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

// Fonction utilitaire pour vérifier si un JWT est expiré
const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convertir en millisecondes
        return Date.now() >= exp;
    } catch {
        return true; // Si décodage échoue, considérer comme expiré
    }
};

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
        
        // Vérifier si le token existe ET n'est pas expiré
        if (savedToken && savedRole && savedPseudo) {
            if (isTokenExpired(savedToken)) {
                // Token expiré, nettoyer le localStorage
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("pseudo");
                localStorage.removeItem("email");
                return false;
            }
            return true;
        }
        return false;
    });
    const [role, setRole] = useState<"CLIENT" | "ADMIN" | null>(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken && isTokenExpired(savedToken)) {
            return null;
        }
        return localStorage.getItem("role") as "CLIENT" | "ADMIN" | null;
    });
    const [pseudo, setPseudo] = useState(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken && isTokenExpired(savedToken)) {
            return "";
        }
        return localStorage.getItem("pseudo") || "";
    });
    const [email, setEmail] = useState(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken && isTokenExpired(savedToken)) {
            return "";
        }
        return localStorage.getItem("email") || "";
    });
    const [token, setToken] = useState<string | null>(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken && isTokenExpired(savedToken)) {
            return null;
        }
        return savedToken;
    });
    const [isLoading, _setIsLoading] = useState(false);

    // Vérifier l'expiration du token périodiquement (toutes les minutes)
    useEffect(() => {
        const checkTokenExpiration = () => {
            const savedToken = localStorage.getItem("token");
            if (savedToken && isTokenExpired(savedToken)) {
                console.warn("Token expiré, déconnexion automatique");
                logout();
            }
        };

        // Vérifier immédiatement au montage
        checkTokenExpiration();

        // Puis toutes les 60 secondes
        const interval = setInterval(checkTokenExpiration, 60000);

        return () => clearInterval(interval);
    }, [token]); // Relancer si le token change

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
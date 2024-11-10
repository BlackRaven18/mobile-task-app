import AuthService from "@/services/AuthService";
import { router } from "expo-router";
import { createContext, useState, useContext, PropsWithChildren } from "react";

const AuthContext = createContext({
    username: "",
    isSignedIn: false,
    signIn: () => {},
    signOut: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [username, setUsername] = useState("");

    const signIn = () => {
        setIsSignedIn(true)
        setUsername(AuthService.getUsername() ?? "");
        router.replace("/(app)")
    };
    const signOut = () => {
        setIsSignedIn(false)
    };

    return (
        <AuthContext.Provider value={{ username, isSignedIn, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
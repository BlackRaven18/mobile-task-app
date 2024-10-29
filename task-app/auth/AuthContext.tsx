import AuthService from "@/services/AuthService";
import { router } from "expo-router";
import { createContext, useState, useContext, PropsWithChildren } from "react";

const AuthContext = createContext({
    isSignedIn: false,
    signIn: () => {},
    signOut: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    const signIn = () => {
        setIsSignedIn(true)
        router.replace("/(app)")
        console.log("Signed in")
    };
    const signOut = () => {
        setIsSignedIn(false)
        //AuthService.signOut()
    };

    return (
        <AuthContext.Provider value={{ isSignedIn, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
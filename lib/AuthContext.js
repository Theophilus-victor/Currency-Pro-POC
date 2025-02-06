import { createContext, useContext, useEffect, useState} from "react";
import { auth } from "./firebase";
import { googleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContent();

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,(user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };
    const logout = async() => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value = {{user, signInWithGoogle, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
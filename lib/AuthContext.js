import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const useRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        uid: user.uid,
                        name: user.displayName,
                        email: user.email,
                        role: "traveller", // Default role
                        balance_usd: 0 ,
                        balance_inr: 0 ,
                    });
                }
                setUser(user);
            } else {
                setUser(null);
            }
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
import { useAuth } from "../AuthContext";
import { useRouter } from "nextrouter";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if(!user) {
            router.push("/login");
        }
    }, [user, router]);

    return user ? children : null;
}
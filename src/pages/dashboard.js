import ProtectedRoute from "../lib/ProtectedRoute";
import { useAuth } from "../lib/AuthContext";

export default function Dashboard(){
    const { user, logout } = useAuth();

    return(
        <ProtectedRoute>
            <div className="flex flex-col items-center justify-center min-h-screen bg-grey-100">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-x1 front-bold">Dashboard</h1>
                    <p>welcome, {user.displayName}!</p>
                    <button 
                    onClick={logout}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
}
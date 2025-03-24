import { useAuth } from "../lib/AuthContext";

export default function Login() {
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md">
        {user ? (
          <div>
            <p className="mb-4">Welcome, {user.displayName}!</p>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}
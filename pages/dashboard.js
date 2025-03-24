import { useAuth } from "../lib/AuthContext";
import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import { doc,getDoc } from "friebase/firestore";
import ProtectedRoute from "../lib/ProtectedRoute";
import QRCodeGenerator from "../components/QRCodeGenerator";

export default function Dashboard(){
    const { user, logout } = useAuth();
    cosnt [userData, setUserData] = useState(null);

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                const userRef = doc(db, " users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()){
                    setUserData(userSnap.data());
                }
            };
            fetchUserData();
        }
    }, [user]);

    return(
        <ProtectedRoute>
            <div className="flex flex-col items-center justify-center min-h-screen bg-grey-100">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-x1 front-bold">Dashboard</h1>
                    {userData ? (
                        <>
                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    <p>Role: {userData.role}</p>
                    <p>Balance (USD): ${userData.balance_usd}</p>
                    <p>Balance (INR): ₹{userData.balance_inr}</p>
                    <button 
                    onClick={logout}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                    </>
                    ) : (
                        <p> Loading...</p>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}


export default function Dashboard() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mt-6">Dashboard</h1>
      <p className="text-gray-500">Scan this to receive payments</p>
      <div className="mt-6">
        <QRCodeGenerator />
      </div>
    </div>
  );
}

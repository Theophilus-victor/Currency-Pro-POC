import { useState, useEffect } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";
import { useAuth } from "../lib/AuthContext";
import ProtectedRoute from "../lib/ProtectedRoute";
import QRScanner from "../components/QRScanner";

export default function Listings() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const querySnapshot = await getDocs(collection(db, "listings"));
      const fetchedListings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListings(fetchedListings);
    };
    fetchListings();
  }, []);

  const acceptListing = async (listing) => {
    if (!user) return alert("You must be logged in to accept a listing.");
    
    // Mark listing as completed
    await updateDoc(doc(db, "listings", listing.id), {
      status: "completed",
    });

    // Store transaction record
    await addDoc(collection(db, "transactions"), {
      senderId: user.uid,
      receiverId: listing.userId,
      usd_sent: listing.usd_amount,
      inr_received: listing.inr_amount,
      timestamp: new Date().toISOString(),
    });

    alert("Transaction Completed!");
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Currency Exchange Listings</h1>

        <h2 className="text-xl font-semibold mb-2">Available Listings</h2>
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="p-4 border rounded-lg bg-white shadow-md">
              <p><strong>USD Amount:</strong> ${listing.usd_amount}</p>
              <p><strong>Exchange Rate:</strong> {listing.exchange_rate} INR/USD</p>
              <p><strong>INR Amount:</strong> ₹{listing.inr_amount}</p>
              <p><strong>Status:</strong> {listing.status}</p>

              {listing.status === "available" && (
                <button
                  onClick={() => acceptListing(listing)}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  Accept Listing
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}


export default function Listings() {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Exchange Listings</h1>
      <div className="flex justify-center">
        <QRScanner />
      </div>
    </div>
  );
}

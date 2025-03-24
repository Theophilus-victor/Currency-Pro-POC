import { useState, useEffect, useCallback } from "react";
import { db } from "../lib/firebaseConfig";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { useAuth } from "../lib/AuthContext";
import { toast } from "react-toastify";

export default function Home() {
  const { user } = useAuth();
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  // Fetch user balance from Firestore
  const fetchUserBalance = useCallback(async () => {
    if (!user) {
      console.log("No user logged in.");
      return;
    }
    console.log("Fetching balance for:", user.uid);
  
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
  
    if (userSnap.exists()) {
      console.log("User balance:", userSnap.data());
      setUserBalance(userSnap.data());
    } else {
      console.log("User document does not exist in Firestore.");
    }
  }, [user]);
  

  // Fetch real-time exchange rate
  const fetchExchangeRate = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      const data = await response.json();
      setExchangeRate(data.rates[toCurrency]);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (!user) {
      console.log("User is not logged in.");
    } else {
      console.log("User is logged in:", user.uid);
      fetchUserBalance();
    }
    fetchExchangeRate();
  }, [fetchUserBalance, fetchExchangeRate, user]);  

  const handleTransaction = async () => {
    if (!user || !userBalance) {
      console.log("Transaction failed: No user or balance data.");
      return;
    }
  
    if (amount > userBalance.balance_usd) {
      console.log("Insufficient balance.");
      toast.error("Insufficient USD balance.");
      return;
    }
  
    const convertedAmount = amount * exchangeRate;
    console.log(`Converting ${amount} USD to ${convertedAmount} INR...`);
  
    try {
      const userRef = doc(db, "users", user.uid);
  
      // ✅ Debugging Firestore Update
      console.log("Updating Firestore balances...");
  
      await updateDoc(userRef, {
        balance_usd: userBalance.balance_usd - amount,
        balance_inr: userBalance.balance_inr + convertedAmount,
      });
  
      console.log("Firestore updated successfully!");
  
      // ✅ Debugging Firestore Transaction Log
      await addDoc(collection(db, "transactions"), {
        senderId: user.uid,
        usd_sent: amount,
        inr_received: convertedAmount,
        timestamp: new Date().toISOString(),
      });
  
      console.log("Transaction recorded in Firestore!");
      
      toast.success("Transaction successful!");
      fetchUserBalance(); // Refresh user balance
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Transaction failed. Try again.");
    }
  };  

  const handleSwap = () => {
    // Swap the currencies
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);

    // Swap the amounts if they exist
    if (amount) {
      const tempAmount = amount;
      setAmount(exchangeRate ? exchangeRate : 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Currency Converter</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="grid grid-cols-3 gap-2 items-center">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="USD">USD</option>
            <option value="INR">INR</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
          <button onClick={handleSwap} className="p-2 bg-gray-200 rounded-md">⇄</button>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="USD">USD</option>
            <option value="INR">INR</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xl font-semibold">
            {exchangeRate ? (amount * exchangeRate).toFixed(2) : "-"} {toCurrency}
          </p>
        </div>
        <button
          onClick={handleTransaction}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Convert & Save Transaction
        </button>
        <button 
          onClick={handleSwap}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Swap Currencies
        </button>
      </div>
    </div>
  );
}

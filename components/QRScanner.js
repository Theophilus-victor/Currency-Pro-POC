import { useState } from "react";
import QrScanner from "react-qr-scanner";

export default function QRScanner() {
  const [scannedData, setScannedData] = useState(null);
  const [amount, setAmount] = useState("");

  const handleScan = (data) => {
    if (data) setScannedData(JSON.parse(data.text));
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-xl font-semibold mb-2">Scan to Pay</h2>
      <div className="border p-2">
        <QrScanner delay={300} onScan={handleScan} style={{ width: "100%" }} />
      </div>
      
      {scannedData && (
        <div className="mt-4">
          <p className="text-gray-600">Receiver ID: {scannedData.userId}</p>
          <input
            type="number"
            placeholder="Enter USD amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 mt-2 w-full"
          />
          <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
            Send Money
          </button>
        </div>
      )}
    </div>
  );
}

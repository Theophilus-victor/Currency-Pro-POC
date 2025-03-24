import { useAuth } from "../src/lib/lib/AuthContext";
import QRCode from "qrcode.react";

export default function QRCodeGenerator() {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  const qrData = JSON.stringify({ userId: user.uid });

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Your Payment QR Code</h2>
      <QRCode value={qrData} size={200} />
      <p className="mt-2 text-gray-500">Others can scan this to send you USD.</p>
    </div>
  );
}

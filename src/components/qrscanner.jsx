import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./qrscanner.css";

export default function QRScanner({ onScan, onClose }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
        onClose();
      },
      (error) => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScan, onClose]);

  return (
    <div className="qr-overlay">
      <div className="qr-box">
        <h3>Scan QR Code</h3>
        <div id="qr-reader" />
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

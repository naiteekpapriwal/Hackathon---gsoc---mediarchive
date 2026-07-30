import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    // Initialize the scanner
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    const onScan = (decodedText, decodedResult) => {
      // Pause or stop scanning once a code is found so it doesn't fire multiple times
      scannerRef.current.clear();
      onScanSuccess(decodedText);
    };

    const onScanFailure = (error) => {
      // Usually ignore these errors as it just means a QR code hasn't been found yet
    };

    scannerRef.current.render(onScan, onScanFailure);

    // Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, [onScanSuccess]);

  return (
    <div id="qr-reader" style={{ width: '100%', margin: '0 auto', maxWidth: '300px' }}></div>
  );
};

export default QRScanner;

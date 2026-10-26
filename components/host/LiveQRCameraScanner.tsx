'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RefreshCw, Upload, AlertCircle, CheckCircle2, Volume2 } from 'lucide-react';

interface LiveQRCameraScannerProps {
  onScan: (decodedText: string) => void;
  isProcessing?: boolean;
}

export function LiveQRCameraScanner({ onScan, isProcessing }: LiveQRCameraScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const scannerRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  // Play a pleasant verification beep using Web Audio API
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.18);
    } catch {}
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopCamera();
    };
  }, []);

  const getHtml5QrCode = async () => {
    const { Html5Qrcode } = await import('html5-qrcode');
    return Html5Qrcode;
  };

  const startCamera = async (cameraId?: string) => {
    setErrorMsg(null);
    try {
      const Html5Qrcode = await getHtml5QrCode();

      // Check available camera devices
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        setErrorMsg('No camera hardware found on this device. You can upload a QR image or enter ticket ID below.');
        return;
      }

      setCameras(devices);
      const camIdToUse = cameraId || selectedCamera || devices[0].id;
      setSelectedCamera(camIdToUse);

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-reader-container');
      }

      // If already scanning, stop first
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }

      await scannerRef.current.start(
        camIdToUse,
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
        },
        (decodedText: string) => {
          playBeep();
          onScan(decodedText);
        },
        () => {
          // Frame scan error (expected on blank frames, ignore)
        }
      );

      if (isMountedRef.current) {
        setIsScanning(true);
      }
    } catch (err: any) {
      console.error('Camera start error:', err);
      let message = 'Failed to access camera. Please allow camera permissions in your browser.';
      if (err?.name === 'NotAllowedError') {
        message = 'Camera permission denied. Please grant camera access in browser site settings.';
      } else if (err?.name === 'NotFoundError') {
        message = 'No video camera detected on this system.';
      }
      setErrorMsg(message);
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error('Error stopping camera:', err);
      }
    }
    if (isMountedRef.current) {
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    try {
      const Html5Qrcode = await getHtml5QrCode();
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-reader-container');
      }
      const decodedText = await scannerRef.current.scanFile(file, true);
      playBeep();
      onScan(decodedText);
    } catch (err) {
      setErrorMsg('No valid QR code detected in the uploaded image.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Viewfinder Container */}
      <div className="relative rounded-2xl bg-black border-2 border-dashed border-indigo-500/40 overflow-hidden min-h-[280px] flex flex-col items-center justify-center p-2">
        <div id="qr-reader-container" className="w-full max-w-[320px] overflow-hidden rounded-xl" />

        {/* State when camera is OFF */}
        {!isScanning && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
              <Camera className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Live Camera Scanner</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Scan attendee tickets using device camera for instant verification.
              </p>
            </div>
            <button
              type="button"
              onClick={() => startCamera()}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera</span>
            </button>
          </div>
        )}

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2 z-20">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs font-bold font-mono">Verifying Ticket...</span>
          </div>
        )}
      </div>

      {/* Camera Controls & Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        {isScanning ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={stopCamera}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-semibold flex items-center gap-1.5"
            >
              <CameraOff className="w-3.5 h-3.5" />
              <span>Stop Camera</span>
            </button>

            {cameras.length > 1 && (
              <select
                value={selectedCamera}
                onChange={(e) => startCamera(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
              >
                {cameras.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label || `Camera ${c.id.substring(0, 5)}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* File Upload Scanner as Fallback */}
            <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>Upload QR Image / Screenshot</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Audio chime enabled</span>
        </div>
      </div>

      {/* Error alert if permissions or camera fails */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

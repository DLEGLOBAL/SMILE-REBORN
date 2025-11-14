
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { UploadIcon, SparkleIcon, CameraIcon, XIcon } from './icons';

interface UploadScreenProps {
  onImageUploaded: (file: File) => void;
  onError: (message: string) => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({ onImageUploaded, onError }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cleanup stream on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        onError("File size exceeds 4MB. Please choose a smaller image.");
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        onError("Invalid file type. Please upload a JPG, PNG, or WEBP image.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      onError(''); // Clear previous errors
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const openCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      onError("Camera is not supported on this device or browser.");
      return;
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err instanceof Error && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
        onError("Camera permission was denied. Please allow camera access in your browser settings.");
      } else {
        onError("Could not access the camera. Please ensure it is not being used by another application.");
      }
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(blob));
            onError('');
            closeCamera();
          } else {
            onError("Could not capture image. Please try again.");
            closeCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };
  
  const handleSubmit = useCallback(() => {
    if (selectedFile) {
      onImageUploaded(selectedFile);
    }
  }, [selectedFile, onImageUploaded]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-text-dark animate-fade-in">
        <div className="w-full max-w-lg text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gold-dark">Upload Your Photo</h2>
          <p className="mt-4 text-md sm:text-lg text-text-light">
            For the best results, use a clear, well-lit, close-up photo of your smile.
          </p>

          <div
            className={`mt-8 w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors duration-300 ${
              previewUrl ? 'border-aqua-main bg-aqua-light/20' : 'border-gold-light'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/jpeg, image/png, image/webp"
            />
            {previewUrl ? (
              <img src={previewUrl} alt="Smile preview" className="w-full h-full object-contain rounded-xl p-2" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg font-semibold text-gold-dark mb-4">Add your photo</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={handleUploadClick} className="flex items-center gap-2 px-6 py-3 bg-white border border-gold-main text-gold-dark font-semibold rounded-full hover:bg-gold-light/30 transition-colors">
                    <UploadIcon className="h-5 w-5" />
                    Upload File
                  </button>
                  <button onClick={openCamera} className="flex items-center gap-2 px-6 py-3 bg-white border border-gold-main text-gold-dark font-semibold rounded-full hover:bg-gold-light/30 transition-colors">
                    <CameraIcon className="h-5 w-5" />
                    Use Camera
                  </button>
                </div>
                <p className="mt-4 text-sm text-text-light">PNG, JPG, or WEBP (Max 4MB)</p>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedFile}
            className="group mt-8 w-full inline-flex items-center justify-center px-8 py-4 bg-aqua-main text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform enabled:hover:scale-105 enabled:hover:bg-aqua-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Transform My Smile
            <SparkleIcon className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
      
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
          <video ref={videoRef} autoPlay playsInline className="w-full max-w-3xl h-auto rounded-lg shadow-2xl"></video>
          <canvas ref={canvasRef} className="hidden"></canvas>
          <div className="mt-6 flex items-center gap-4">
            <button 
              onClick={handleCapture} 
              className="w-20 h-20 bg-white rounded-full border-4 border-aqua-main flex items-center justify-center text-aqua-main font-bold hover:bg-aqua-light transition-colors"
              aria-label="Capture photo"
            >
              <div className="w-16 h-16 bg-white rounded-full"></div>
            </button>
          </div>
           <button onClick={closeCamera} className="absolute top-4 right-4 bg-white/20 text-white rounded-full p-3 hover:bg-white/40" aria-label="Close camera">
              <XIcon className="w-6 h-6" />
            </button>
        </div>
      )}
    </>
  );
};
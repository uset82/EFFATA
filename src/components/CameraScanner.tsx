import { useState, useRef, useEffect } from "react";
import { Camera, BarChart3, ArrowLeft, RotateCcw, Zap, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CameraScannerProps {
  onScanComplete: (data: string) => void;
  onBack: () => void;
}

const CameraScanner = ({ onScanComplete, onBack }: CameraScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<'barcode' | 'ingredients'>('barcode');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsScanning(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('No puedo acceder a la cámara, causa. ¿Le diste permiso?');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert to base64 for processing
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Simulate processing with mock data
    setTimeout(() => {
      const mockData = scanMode === 'barcode' 
        ? 'barcode:123456789' 
        : 'ingredients:photo_captured';
      
      onScanComplete(mockData);
      stopCamera();
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate processing with mock data
    setTimeout(() => {
      const mockData = scanMode === 'barcode' 
        ? 'barcode:123456789' 
        : 'ingredients:photo_uploaded';
      
      onScanComplete(mockData);
    }, 1500);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleBack = () => {
    stopCamera();
    onBack();
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Atrás
        </Button>
        <h2 className="text-xl font-bold">Escanear</h2>
        <div className="w-16" /> {/* Spacer */}
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2">
        <Button
          variant={scanMode === 'barcode' ? 'default' : 'outline'}
          onClick={() => setScanMode('barcode')}
          className="flex-1"
          size="sm"
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Código
        </Button>
        <Button
          variant={scanMode === 'ingredients' ? 'default' : 'outline'}
          onClick={() => setScanMode('ingredients')}
          className="flex-1"
          size="sm"
        >
          <Camera className="mr-2 h-4 w-4" />
          Ingredientes
        </Button>
      </div>

      {/* Camera View */}
      <Card className="relative overflow-hidden">
        {!isScanning ? (
          <div className="aspect-[4/3] bg-muted/20 flex flex-col items-center justify-center p-8 text-center">
            <Camera className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-bold mb-2">
              {scanMode === 'barcode' ? 'Buscar código de barras' : 'Fotografiar ingredientes'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {scanMode === 'barcode' 
                ? 'Apunta al código de barras del producto o sube una foto'
                : 'Toma una foto clara de los ingredientes o sube una existente'
              }
            </p>
            <div className="flex gap-3">
              <Button onClick={startCamera} className="font-bold">
                <Camera className="mr-2 h-4 w-4" />
                Cámara
              </Button>
              <Button onClick={triggerFileUpload} variant="outline" className="font-bold">
                <Upload className="mr-2 h-4 w-4" />
                Subir Foto
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            {cameraError ? (
              <div className="aspect-[4/3] bg-destructive/10 flex flex-col items-center justify-center p-8 text-center">
                <div className="text-destructive mb-4">
                  <Camera className="h-16 w-16 mx-auto mb-2" />
                  <p className="font-bold">{cameraError}</p>
                </div>
                <Button onClick={startCamera} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reintentar
                </Button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="w-full aspect-[4/3] object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-primary bg-primary/10 rounded-lg p-4">
                    <div className="w-48 h-36 border-2 border-primary border-dashed rounded-lg flex items-center justify-center">
                      {scanMode === 'barcode' ? (
                        <BarChart3 className="h-8 w-8 text-primary" />
                      ) : (
                        <Camera className="h-8 w-8 text-primary" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Capture button */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <Button
                    onClick={captureImage}
                    size="lg"
                    className="rounded-full h-16 w-16 p-0"
                  >
                    <Zap className="h-6 w-6" />
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Card>

      {/* Instructions */}
      <Card className="p-4 bg-accent/10">
        <div className="text-center">
          <h4 className="font-bold mb-1">
            {scanMode === 'barcode' ? '📱 Código de Barras' : '📷 Ingredientes'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {scanMode === 'barcode'
              ? 'Centra el código en el recuadro y espera a que lo detecte automáticamente'
              : 'Asegúrate de que se lean bien todos los ingredientes en la foto'
            }
          </p>
        </div>
      </Card>

      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default CameraScanner;
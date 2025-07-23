import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, Upload, ArrowLeft, RotateCcw, Zap, ScanLine, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { analyzeProductImage, convertFileToBase64 } from "@/lib/gemini";

interface CameraScannerProps {
  onScanComplete: (data: string) => void;
  onBack: () => void;
}

const CameraScanner = ({ onScanComplete, onBack }: CameraScannerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<'barcode' | 'ingredients'>('barcode');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accediendo a la cámara:', err);
      setError('No se pudo acceder a la cámara. Por favor verifica los permisos o usa la opción de subir archivo.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsCameraActive(false);
    }
  }, [cameraStream]);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    await handleImageAnalysis(imageData);
  }, [scanMode]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageData = await convertFileToBase64(file);
      await handleImageAnalysis(imageData);
    } catch (err) {
      setError('Error procesando el archivo. Por favor inténtalo de nuevo.');
    }
  }, [scanMode]);

  const handleImageAnalysis = async (imageData: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const analysis = await analyzeProductImage(imageData, scanMode);
      onScanComplete(JSON.stringify(analysis));
    } catch (err) {
      console.error('Error en análisis:', err);
      setError('Error analizando la imagen. Por favor asegúrate de que la imagen sea clara e inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="space-y-6 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBack}
          className="border-2 border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/20 hover:border-emerald-400 font-bold backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Atrás
        </Button>
        <h2 className="text-xl font-bold text-white">Escanear Producto</h2>
        <div className="w-20"></div>
      </div>

      {/* Scan Mode Toggle */}
      <Card className="p-4 bg-black/30 backdrop-blur-xl border border-white/20">
        <div className="space-y-3">
          <p className="text-sm font-medium text-white text-center">Modo de Escaneo</p>
          <div className="flex gap-2">
            <Button
              variant={scanMode === 'barcode' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScanMode('barcode')}
              className={`flex-1 ${scanMode === 'barcode' 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'border-white/20 text-white hover:bg-white/10'
              }`}
            >
              <ScanLine className="mr-2 h-4 w-4" />
              Código de Barras
            </Button>
            <Button
              variant={scanMode === 'ingredients' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScanMode('ingredients')}
              className={`flex-1 ${scanMode === 'ingredients' 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'border-white/20 text-white hover:bg-white/10'
              }`}
            >
              <FileImage className="mr-2 h-4 w-4" />
              Ingredientes
            </Button>
          </div>
          <div className="text-xs text-slate-400 text-center">
            {scanMode === 'barcode' 
              ? 'Escanea el código de barras del producto' 
              : 'Fotografía la lista de ingredientes'
            }
          </div>
        </div>
      </Card>

      {/* Camera Section */}
      <Card className="p-4 bg-black/30 backdrop-blur-xl border border-white/20">
        <div className="space-y-4">
          {!isCameraActive ? (
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-xl"></div>
                <Camera className="h-16 w-16 mx-auto text-emerald-400 relative z-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {scanMode === 'barcode' ? 'Escanear Código de Barras' : 'Fotografiar Ingredientes'}
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  {scanMode === 'barcode' 
                    ? 'Activa la cámara para escanear el código de barras del producto'
                    : 'Activa la cámara para fotografiar la lista de ingredientes'
                  }
                </p>
              </div>
              <Button 
                onClick={startCamera}
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 font-bold"
                size="lg"
              >
                <Camera className="mr-2 h-5 w-5" />
                Activar Cámara
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 border-2 border-emerald-400/50 rounded-lg pointer-events-none">
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-black/70 text-emerald-400 border-emerald-400/50">
                      <Zap className="mr-1 h-3 w-3" />
                      {scanMode === 'barcode' ? 'Código de Barras' : 'Ingredientes'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={capturePhoto}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 font-bold"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <RotateCcw className="mr-2 h-5 w-5 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-5 w-5" />
                      Capturar
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={stopCamera}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Detener
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* File Upload Alternative */}
      <Card className="p-4 bg-black/30 backdrop-blur-xl border border-white/20">
        <div className="text-center space-y-3">
          <Upload className="h-8 w-8 mx-auto text-slate-400" />
          <div>
            <h3 className="font-medium text-white">Subir desde Galería</h3>
            <p className="text-sm text-slate-400">
              {scanMode === 'barcode' 
                ? 'Sube una foto del código de barras' 
                : 'Sube una foto de los ingredientes'
              }
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full border-white/20 text-white hover:bg-white/10"
          >
            <Upload className="mr-2 h-4 w-4" />
            Seleccionar Archivo
          </Button>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-red-900/30 backdrop-blur-xl border border-red-500/50">
          <p className="text-red-200 text-sm text-center">{error}</p>
        </Card>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScanner;
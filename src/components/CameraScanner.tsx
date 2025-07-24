import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, Upload, ArrowLeft, RotateCcw, Zap, ScanLine, FileImage, AlertCircle, Smartphone } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setCameraError(null);
      
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported');
      }

      // Enhanced mobile camera configuration
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera
          width: isMobile ? { ideal: 1280, max: 1920 } : { ideal: 1920 },
          height: isMobile ? { ideal: 720, max: 1080 } : { ideal: 1080 },
          aspectRatio: isMobile ? 16/9 : undefined,
          frameRate: { ideal: 30, max: 60 }
        },
        audio: false
      };

      console.log('Requesting camera with constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setCameraStream(stream);
      setIsCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to load metadata
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded:', {
            width: videoRef.current?.videoWidth,
            height: videoRef.current?.videoHeight
          });
        };
      }
    } catch (err: any) {
      console.error('Error accediendo a la cámara:', err);
      
      let errorMessage = 'No se pudo acceder a la cámara.';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = '❌ Permisos de cámara denegados. Por favor permite el acceso a la cámara en tu navegador.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = '📷 No se encontró cámara en tu dispositivo.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = '🚫 Tu navegador no soporta acceso a la cámara.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = '⚠️ La cámara está siendo usada por otra aplicación.';
      } else if (err.message === 'Camera not supported') {
        errorMessage = '📱 Tu dispositivo no soporta acceso a la cámara desde el navegador.';
      }
      
      setCameraError(errorMessage);
      setError(`${errorMessage} Usa la opción "Subir desde Galería" como alternativa.`);
    }
  }, [isMobile]);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsCameraActive(false);
    }
  }, [cameraStream]);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Error: No se pudo acceder al video o canvas');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      setError('Error: No se pudo obtener contexto del canvas');
      return;
    }

    // Ensure video has loaded
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError('Error: El video no está listo. Espera un momento e inténtalo de nuevo.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    console.log('Image captured, size:', imageData.length);
    
    await handleImageAnalysis(imageData);
  }, []);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo es muy grande. Por favor selecciona una imagen menor a 10MB.');
      return;
    }

    try {
      console.log('Processing file:', file.name, file.size, file.type);
      const imageData = await convertFileToBase64(file);
      await handleImageAnalysis(imageData);
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Error procesando el archivo. Por favor inténtalo de nuevo.');
    }
  }, []);

  const handleImageAnalysis = async (imageData: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting image analysis with mode:', scanMode);
      const analysis = await analyzeProductImage(imageData, scanMode);
      console.log('Analysis completed:', analysis);
      onScanComplete(JSON.stringify(analysis));
    } catch (err: any) {
      console.error('Error en análisis:', err);
      
      let errorMessage = 'Error analizando la imagen.';
      if (err.message.includes('API')) {
        errorMessage = 'Error de conexión con el servicio de análisis. Verifica tu conexión a internet.';
      } else if (err.message.includes('JSON')) {
        errorMessage = 'Error procesando la respuesta del análisis. Inténtalo de nuevo.';
      }
      
      setError(`${errorMessage} Por favor asegúrate de que la imagen sea clara e inténtalo de nuevo.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Add the enhanced thinking screen when loading
  if (isLoading) {
    return (
      <div className="space-y-6 mt-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onBack}
            className="border border-white/20 text-white hover:bg-white/10 backdrop-blur-xl bg-black/20 rounded-full px-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Atrás
          </Button>
          <h2 className="text-xl font-semibold text-white/90">Analizando</h2>
          <div className="w-20"></div>
        </div>

        <Card className="p-8 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
          <div className="text-center space-y-8">
            {/* EFFATA Logo/Brand with thinking animation */}
            <div className="relative">
              {/* Outer rotating rings */}
              <div className="absolute inset-0 w-32 h-32 mx-auto">
                <div className="absolute inset-0 border-4 border-transparent border-t-emerald-400 border-r-blue-400 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-3 border-transparent border-b-purple-400 border-l-pink-400 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '3s'}}></div>
              </div>
              
              {/* Pulsing background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
              
              {/* EFFATA Brand Circle */}
              <div className="relative z-10 w-32 h-32 mx-auto flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-sm rounded-full border border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-black text-white mb-1">EFFATA</div>
                  <div className="text-xs text-white/60 font-medium">AI THINKING</div>
                </div>
              </div>
            </div>
            
            {/* Enhanced thinking text with EFFATA branding */}
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-white/90">
                🧠 EFFATA Pensando
                <span className="inline-flex ml-2">
                  <span className="animate-bounce delay-0 text-emerald-400">.</span>
                  <span className="animate-bounce delay-100 text-blue-400">.</span>
                  <span className="animate-bounce delay-200 text-purple-400">.</span>
                </span>
              </h3>
              <p className="text-white/70 text-lg">
                Nuestra IA está analizando cada ingrediente para darte el mejor consejo de salud
              </p>
            </div>
            
            {/* Enhanced progress with animated steps */}
            <div className="space-y-6">
              {/* Main progress bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-white/60">
                  <span>Procesando con IA...</span>
                  <span>🤖</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 rounded-full animate-pulse relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Animated thinking steps */}
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-white/80">Leyendo etiqueta del producto</span>
                  </div>
                  <span className="text-emerald-400">✓</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                    <span className="text-white/80">Analizando ingredientes con IA</span>
                  </div>
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-500"></div>
                    <span className="text-white/60">Calculando riesgo para tu salud</span>
                  </div>
                  <span className="text-white/40">⏳</span>
                </div>
              </div>
              
              {/* Fun fact while waiting */}
              <div className="mt-8 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💡</span>
                  <span className="text-white/80 font-medium">¿Sabías que...</span>
                </div>
                <p className="text-white/60 text-sm">
                  EFFATA analiza más de 1000 ingredientes diferentes para darte la calificación más precisa
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

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

      {/* Mobile Detection Info */}
      {isMobile && (
        <Card className="p-3 bg-blue-900/30 backdrop-blur-xl border border-blue-500/50">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-blue-400" />
            <p className="text-blue-200 text-sm">
              📱 Dispositivo móvil detectado - Optimizado para tu teléfono
            </p>
          </div>
        </Card>
      )}

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
                {isMobile && (
                  <p className="text-yellow-300 text-xs mb-4">
                    💡 En móviles, asegúrate de permitir el acceso a la cámara cuando te lo solicite
                  </p>
                )}
              </div>
              <Button 
                onClick={startCamera}
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 font-bold"
                size="lg"
              >
                <Camera className="mr-2 h-5 w-5" />
                Activar Cámara
              </Button>
              
              {/* Camera error display */}
              {cameraError && (
                <div className="mt-4 p-3 bg-red-900/30 backdrop-blur-xl border border-red-500/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="text-red-200 text-sm">{cameraError}</p>
                  </div>
                </div>
              )}
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
                  {isMobile && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-black/70 text-blue-400 border-blue-400/50">
                        <Smartphone className="mr-1 h-3 w-3" />
                        Móvil
                      </Badge>
                    </div>
                  )}
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

      {/* File Upload Alternative - Enhanced for mobile */}
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
            {isMobile && (
              <p className="text-emerald-300 text-xs mt-1">
                ⭐ Recomendado para móviles - Más fácil y confiable
              </p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture={isMobile ? "environment" : undefined}
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
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </Card>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScanner;
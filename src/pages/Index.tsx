import { useState } from "react";
import { Camera, Shield, Info, Eye, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CameraScanner from "@/components/CameraScanner";
import ProductGrader from "@/components/ProductGrader";
import OnboardingModal from "@/components/OnboardingModal";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type AppState = 'welcome' | 'camera' | 'grading';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleScanComplete = (data: string) => {
    setScannedData(data);
    setAppState('grading');
  };

  const resetApp = () => {
    setAppState('welcome');
    setScannedData(null);
  };

  if (showOnboarding) {
    return (
      <OnboardingModal 
        onComplete={() => setShowOnboarding(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Glassy Effect */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 text-white p-4 shadow-2xl">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 cursor-pointer group">
                <Eye className="h-8 w-8 group-hover:animate-pulse text-emerald-400" />
                <h1 className="text-2xl font-black group-hover:scale-105 transition-transform bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  EFFATA
                </h1>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md bg-slate-900/95 backdrop-blur-xl border border-white/20">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-xl text-white">
                  <User className="h-6 w-6 text-emerald-400" />
                  Información del Desarrollador
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-4 text-left">
                    <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 p-4 rounded-lg border border-white/10">
                      <h3 className="font-bold text-lg text-white mb-2">Carlos Carpio</h3>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">uset82@gmail.com</span>
                      </div>
                    </div>
                    <div className="text-sm text-slate-300">
                      <p>
                        Creador de <span className="font-bold text-emerald-400">EFFATA</span>, 
                        el escáner universal de salud y seguridad de productos que protege lo que toca tu cuerpo.
                      </p>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogAction className="w-full bg-emerald-600 hover:bg-emerald-700">
                Cerrar
              </AlertDialogAction>
            </AlertDialogContent>
          </AlertDialog>
          {appState !== 'welcome' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetApp}
              className="border-2 border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/20 hover:border-emerald-400 font-bold backdrop-blur-sm"
            >
              Nuevo Escaneo
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-sm mx-auto p-4">
        {appState === 'welcome' && (
          <div className="space-y-6 mt-8 max-w-lg mx-auto">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
                Abre los ojos a<br />
                <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  lo que te toca
                </span>
              </h2>
              <p className="text-lg md:text-xl text-slate-300 font-medium">
                Escanea y analiza instantáneamente cualquier producto para detectar riesgos de salud y seguridad
              </p>
            </div>

            <Card className="p-6 md:p-8 bg-black/30 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-xl"></div>
                  <Shield className="h-16 w-16 md:h-20 md:w-20 mx-auto text-emerald-400 relative z-10" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">Escanea Cualquier Producto</h3>
                  <p className="text-slate-300 mb-4 md:text-lg">
                    Comida, cosméticos, cremas, pasta de dientes - cualquier cosa que toque tu cuerpo
                  </p>
                </div>
                <Button 
                  onClick={() => setAppState('camera')}
                  className="w-full text-lg font-bold py-6 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg"
                  size="lg"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Comenzar Escaneo
                </Button>
              </div>
            </Card>

            {/* Product Categories */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 bg-black/20 backdrop-blur-xl border border-white/10">
                <div className="text-center">
                  <div className="text-2xl mb-2">🍎</div>
                  <p className="text-sm font-medium text-white">Comida y Bebidas</p>
                  <p className="text-xs text-slate-400">Números E, aditivos</p>
                </div>
              </Card>
              <Card className="p-4 bg-black/20 backdrop-blur-xl border border-white/10">
                <div className="text-center">
                  <div className="text-2xl mb-2">💄</div>
                  <p className="text-sm font-medium text-white">Cosméticos</p>
                  <p className="text-xs text-slate-400">Ingredientes INCI</p>
                </div>
              </Card>
              <Card className="p-4 bg-black/20 backdrop-blur-xl border border-white/10">
                <div className="text-center">
                  <div className="text-2xl mb-2">🧴</div>
                  <p className="text-sm font-medium text-white">Cuidado Personal</p>
                  <p className="text-xs text-slate-400">Cremas, aceites, lociones</p>
                </div>
              </Card>
              <Card className="p-4 bg-black/20 backdrop-blur-xl border border-white/10">
                <div className="text-center">
                  <div className="text-2xl mb-2">🦷</div>
                  <p className="text-sm font-medium text-white">Cuidado Bucal</p>
                  <p className="text-xs text-slate-400">Pasta de dientes, enjuague</p>
                </div>
              </Card>
            </div>

            <div className="bg-black/20 backdrop-blur-xl p-4 rounded-lg border border-white/10">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold mb-1 text-white">Cómo funciona</p>
                  <p className="text-slate-300">
                    El análisis de IA califica productos de A (excelente) a E (evitar). 
                    Verificamos carcinógenos, alérgenos, ingredientes prohibidos y toxicidad.
                  </p>
                </div>
              </div>
            </div>

            {/* Grade Legend - Fixed Vertical Alignment */}
            <div className="bg-black/20 backdrop-blur-xl p-4 rounded-lg border border-white/10">
              <p className="text-center text-sm font-semibold text-white mb-3">Escala de Calificación</p>
              <div className="flex justify-center gap-4 text-xs">
                <div className="flex flex-col items-center">
                  <span className="text-lg mb-1">😍</span>
                  <span className="px-2 py-1 rounded bg-green-600/80 text-white font-bold">A</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg mb-1">😊</span>
                  <span className="px-2 py-1 rounded bg-green-500/80 text-white font-bold">B</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg mb-1">😐</span>
                  <span className="px-2 py-1 rounded bg-yellow-500/80 text-black font-bold">C</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg mb-1">😟</span>
                  <span className="px-2 py-1 rounded bg-orange-500/80 text-white font-bold">D</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg mb-1">🤢</span>
                  <span className="px-2 py-1 rounded bg-red-600/80 text-white font-bold">E</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {appState === 'camera' && (
          <CameraScanner 
            onScanComplete={handleScanComplete}
            onBack={() => setAppState('welcome')}
          />
        )}

        {appState === 'grading' && scannedData && (
          <ProductGrader 
            productData={scannedData}
            onBack={() => setAppState('welcome')}
            onScanAgain={() => setAppState('camera')}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
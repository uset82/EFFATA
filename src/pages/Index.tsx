import { useState } from "react";
import { Camera, Zap, Info, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import CameraScanner from "@/components/CameraScanner";
import ProductGrader from "@/components/ProductGrader";
import OnboardingModal from "@/components/OnboardingModal";

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group">
                <Zap className="h-8 w-8 group-hover:animate-pulse" />
                <h1 className="text-2xl font-black group-hover:scale-105 transition-transform">
                  Trágatelo
                </h1>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-xl">
                  <User className="h-6 w-6 text-primary" />
                  Información del Desarrollador
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-4 text-left">
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
                      <h3 className="font-bold text-lg text-foreground mb-2">Carlos Carpio</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">uset82@gmail.com</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        Desarrollador de <span className="font-bold text-primary">Trágatelo</span>, 
                        la app que te ayuda a descubrir la verdad sobre lo que comes.
                      </p>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogAction className="w-full">
                Cerrar
              </AlertDialogAction>
            </AlertDialogContent>
          </AlertDialog>
          {appState !== 'welcome' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetApp}
              className="border-2 border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-primary font-bold"
            >
              Nuevo
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-sm mx-auto p-4">
        {appState === 'welcome' && (
          <div className="space-y-6 mt-8 max-w-lg mx-auto">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground">
                ¿Te lo vas a<br />
                <span className="text-primary">tragar</span>?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-medium">
                Descubre la verdad sobre lo que comes, causa
              </p>
            </div>

            <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-2">
              <div className="text-center space-y-4">
                <Camera className="h-16 w-16 md:h-20 md:w-20 mx-auto text-primary" />
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">¡Dale, escanéalo!</h3>
                  <p className="text-muted-foreground mb-4 md:text-lg">
                    Apunta la cámara al código de barras o toma una foto de los ingredientes
                  </p>
                </div>
                <Button 
                  onClick={() => setAppState('camera')}
                  className="w-full text-lg font-bold py-6"
                  size="lg"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Escanear Producto
                </Button>
              </div>
            </Card>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">¿Cómo funciona?</p>
                  <p className="text-muted-foreground">
                    Te decimos si el producto es una joya o una porquería. 
                    Calificación de A (buenazo) a E (ni lo mires, causa).
                  </p>
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
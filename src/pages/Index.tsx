import { useState } from "react";
import { Camera, Zap, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8" />
            <h1 className="text-2xl font-black">Trágatelo</h1>
          </div>
          {appState !== 'welcome' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetApp}
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Nuevo
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-sm mx-auto p-4">
        {appState === 'welcome' && (
          <div className="space-y-6 mt-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-black text-foreground">
                ¿Te lo vas a<br />
                <span className="text-primary">tragar</span>?
              </h2>
              <p className="text-lg text-muted-foreground font-medium">
                Descubre la verdad sobre lo que comes, causa
              </p>
            </div>

            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-2">
              <div className="text-center space-y-4">
                <Camera className="h-16 w-16 mx-auto text-primary" />
                <div>
                  <h3 className="text-xl font-bold mb-2">¡Dale, escanéalo!</h3>
                  <p className="text-muted-foreground mb-4">
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
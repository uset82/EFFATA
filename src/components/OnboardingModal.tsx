import { useState } from "react";
import { Camera, Shield, Eye, ChevronRight, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

interface OnboardingModalProps {
  onComplete: () => void;
}

const OnboardingModal = ({ onComplete }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Eye className="h-16 w-16 text-emerald-400" />,
      title: "Bienvenido a EFFATA",
      description: "Protegemos lo que toca tu cuerpo. Escanea y analiza instantáneamente cualquier producto para detectar riesgos de salud y seguridad.",
      action: "Continuar"
    },
    {
      icon: <Shield className="h-16 w-16 text-blue-400" />,
      title: "Tu Guardián de la Salud",
      description: "Desde comida hasta cosméticos, cremas y pasta de dientes - verificamos carcinógenos, toxinas, alérgenos e ingredientes prohibidos.",
      action: "Saber Más"
    },
    {
      icon: <Camera className="h-16 w-16 text-purple-400" />,
      title: "Permiso de Cámara",
      description: "Necesitamos acceso a la cámara para escanear códigos de barras y etiquetas de ingredientes. Esto permite el análisis de productos en tiempo real.",
      action: "Conceder Permiso"
    },
    {
      icon: <Lock className="h-16 w-16 text-green-400" />,
      title: "Privacidad Primero",
      description: "Tus fotos nunca se almacenan ni comparten. Todo el análisis ocurre de forma segura y tus datos permanecen privados. Cumple con GDPR y CCPA.",
      action: "Entiendo"
    },
    {
      icon: <CheckCircle className="h-16 w-16 text-emerald-400" />,
      title: "Listo para Protegerte",
      description: "Comienza a escanear productos y descubre qué contienen realmente. El conocimiento es tu mejor defensa.",
      action: "Comenzar a Escanear"
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = async () => {
    // Special handling for camera permission step
    if (currentStep === 2) {
      try {
        // Check if we're in a secure context and camera is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.log('Camera not available, proceeding anyway');
        } else {
          // Try to request camera permission
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          // Stop the stream immediately, we just needed permission
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (error) {
        console.log('Camera permission denied or failed:', error);
        // Don't block the flow, just log and continue
      }
    }
    
    // Always proceed to next step or complete
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-sm mx-auto rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/20">
        <div className="p-6">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-emerald-400' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="text-center space-y-6">
            <div className="flex justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-xl"></div>
              <div className="relative z-10">
                {currentStepData.icon}
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-black text-white">
                {currentStepData.title}
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            <Button
              onClick={handleNext}
              className="w-full text-lg font-bold py-6 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
              size="lg"
            >
              {currentStepData.action}
              {!isLastStep && <ChevronRight className="ml-2 h-5 w-5" />}
            </Button>

            {currentStep > 0 && (
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="text-slate-400 hover:text-white"
              >
                Atrás
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
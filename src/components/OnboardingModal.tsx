import { useState } from "react";
import { Camera, Shield, Zap, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

interface OnboardingModalProps {
  onComplete: () => void;
}

const OnboardingModal = ({ onComplete }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Zap className="h-16 w-16 text-primary" />,
      title: "¡Hola, causa!",
      description: "Soy Trágatelo, tu pana que te dice la verdad sobre lo que comes.",
      action: "Siguiente"
    },
    {
      icon: <Camera className="h-16 w-16 text-accent" />,
      title: "Necesito tu cámara",
      description: "Para decirte la verdad sobre lo que te vas a tragar, necesito ver el producto. ¿Dale permiso?",
      action: "Dar Permiso"
    },
    {
      icon: <Shield className="h-16 w-16 text-secondary" />,
      title: "Tu privacidad está segura",
      description: "No guardamos tus fotos ni las mandamos a nadie. Todo se queda en tu celular, tranqui.",
      action: "Entendido"
    },
    {
      icon: <CheckCircle className="h-16 w-16 text-secondary" />,
      title: "¡Listo para empezar!",
      description: "Ahora puedes escanear productos y saber si son una joya o una porquería.",
      action: "¡Empezar!"
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = async () => {
    if (currentStep === 1) {
      // Request camera permission on step 2
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (error) {
        alert("Ey, necesito la cámara para funcionar. Dale permiso, causa.");
        return;
      }
    }
    
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-sm mx-auto rounded-2xl">
        <div className="p-6">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              {currentStepData.icon}
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-black text-foreground">
                {currentStepData.title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            <Button
              onClick={handleNext}
              className="w-full text-lg font-bold py-6"
              size="lg"
            >
              {currentStepData.action}
              {!isLastStep && <ChevronRight className="ml-2 h-5 w-5" />}
            </Button>

            {currentStep > 0 && (
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="text-muted-foreground"
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
import React, { useState, useEffect } from "react";
import { ArrowLeft, Camera, AlertTriangle, CheckCircle, Info, Star, Shield, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { IngredientAnalysis } from "@/lib/gemini";

interface ProductGraderProps {
  productData: string;
  onBack: () => void;
  onScanAgain: () => void;
}

const ProductGrader = ({ productData, onBack, onScanAgain }: ProductGraderProps) => {
  const [analysis, setAnalysis] = useState<IngredientAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Spanish grade results with colors matching the grading scale
  const gradeResults = {
    A: {
      emoji: "😍",
      title: "¡Estupendo, amigo!",
      message: "Es excelente",
      gradient: "from-green-400/30 via-green-500/20 to-green-600/30",
      glowColor: "shadow-green-500/25",
      borderGlow: "shadow-[0_0_30px_rgba(34,197,94,0.3)]",
      iconColor: "text-green-300",
      scoreColor: "text-green-100"
    },
    B: {
      emoji: "😊", 
      title: "Está muy bien",
      message: "Adelante con ello",
      gradient: "from-blue-400/30 via-blue-500/20 to-blue-600/30",
      glowColor: "shadow-blue-500/25",
      borderGlow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
      iconColor: "text-blue-300",
      scoreColor: "text-blue-100"
    },
    C: {
      emoji: "😐",
      title: "Regular...",
      message: "Considéralo con cuidado",
      gradient: "from-yellow-400/30 via-yellow-500/20 to-yellow-600/30",
      glowColor: "shadow-yellow-500/25",
      borderGlow: "shadow-[0_0_30px_rgba(234,179,8,0.3)]",
      iconColor: "text-yellow-300",
      scoreColor: "text-yellow-100"
    },
    D: {
      emoji: "😟",
      title: "Algo flojo...",
      message: "Te recomendamos buscar otra opción",
      gradient: "from-orange-400/30 via-orange-500/20 to-orange-600/30",
      glowColor: "shadow-orange-500/25",
      borderGlow: "shadow-[0_0_30px_rgba(249,115,22,0.3)]",
      iconColor: "text-orange-300",
      scoreColor: "text-orange-100"
    },
    E: {
      emoji: "🤢",
      title: "¡Evítalo!",
      message: "Mejor alejarte de esto",
      gradient: "from-red-400/30 via-red-500/20 to-red-600/30",
      glowColor: "shadow-red-500/25",
      borderGlow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]",
      iconColor: "text-red-300",
      scoreColor: "text-red-100"
    }
  };

  const riskLevelConfig = {
    Low: { icon: CheckCircle, color: "text-emerald-300", label: "Bajo", bgColor: "bg-emerald-500/10" },
    Moderate: { icon: Info, color: "text-blue-300", label: "Moderado", bgColor: "bg-blue-500/10" },
    High: { icon: AlertTriangle, color: "text-orange-300", label: "Alto", bgColor: "bg-orange-500/10" },
    Critical: { icon: Shield, color: "text-red-300", label: "Crítico", bgColor: "bg-red-500/10" }
  };

  useEffect(() => {
    const processProductData = async () => {
      try {
        setIsLoading(true);
        const parsedData = JSON.parse(productData);
        
        // Remove the delay - process immediately
        setAnalysis(parsedData);
      } catch (error) {
        console.error('Error procesando datos del producto:', error);
      } finally {
        setIsLoading(false);
      }
    };

    processProductData();
  }, [productData]);

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

  if (!analysis) {
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
          <h2 className="text-xl font-semibold text-white/90">Error</h2>
          <div className="w-20"></div>
        </div>

        <Card className="p-8 bg-red-500/10 backdrop-blur-2xl border border-red-500/20 rounded-3xl shadow-2xl">
          <div className="text-center space-y-6">
            <AlertTriangle className="h-16 w-16 mx-auto text-red-400" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white/90">Error en el Análisis</h3>
              <p className="text-white/60">No se pudo procesar la información del producto.</p>
            </div>
            <Button 
              onClick={onScanAgain} 
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-full px-8 py-3 font-medium"
            >
              Intentar de Nuevo
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const gradeInfo = gradeResults[analysis.grade];
  const RiskIcon = riskLevelConfig[analysis.riskLevel].icon;

  return (
    <div className="space-y-6 mt-4">
      {/* Header */}
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
        <h2 className="text-xl font-semibold text-white/90">Resultado</h2>
        <div className="w-20"></div>
      </div>

      {/* Grade Scale Legend - Cleaner, more compact design like the first image */}
      <Card className="p-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl">
        <div className="space-y-3">
          <h3 className="text-center text-white/90 font-semibold">Escala de Calificación</h3>
          
          {/* Emoji Row - smaller and more compact */}
          <div className="flex items-center justify-center gap-4">
            <div className="text-2xl">😍</div>
            <div className="text-2xl">😊</div>
            <div className="text-2xl">😐</div>
            <div className="text-2xl">😟</div>
            <div className="text-2xl">🤢</div>
          </div>
          
          {/* Grade Letters Row - smaller boxes, more compact */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-lg">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-lg">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-lg">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-lg">
              <span className="text-white font-bold text-sm">E</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Product Info - Centered */}
      {analysis.productName && (
        <Card className="p-6 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-xl">
          <div className="space-y-3 text-center">
            <h3 className="font-semibold text-white/90 text-xl">{analysis.productName}</h3>
            {analysis.barcode && (
              <p className="text-sm text-white/50 font-mono">Código: {analysis.barcode}</p>
            )}
            <div className="flex justify-center">
              <Badge className="bg-white/10 text-white/80 border-white/20 rounded-full px-3 py-1">
                {analysis.productType === 'Food' ? 'Alimento' :
                 analysis.productType === 'Makeup' ? 'Maquillaje' :
                 analysis.productType === 'Cream' ? 'Crema' :
                 analysis.productType === 'Oil' ? 'Aceite' :
                 analysis.productType === 'Toothpaste' ? 'Pasta Dental' : 'Otro'}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Grade Display - iOS 18 Glassy Style with repositioned grade */}
      <Card className={`relative p-8 bg-gradient-to-br ${gradeInfo.gradient} backdrop-blur-2xl border border-white/20 rounded-3xl ${gradeInfo.borderGlow} shadow-2xl overflow-hidden`}>
        {/* Glassy overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-3xl"></div>
        
        {/* Grade badge in top-right corner - ONLY LETTER */}
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-full w-12 h-12 border border-white/20">
            <span className="text-2xl font-black text-white">{analysis.grade}</span>
          </div>
        </div>
        
        <div className="relative z-10 text-center space-y-6">
          {/* Centered Emoji with glow effect */}
          <div className="relative pt-8">
            <div className={`absolute inset-0 ${gradeInfo.glowColor} blur-2xl rounded-full scale-150`}></div>
            <div className="text-8xl relative z-10">{gradeInfo.emoji}</div>
          </div>
          
          {/* Title and Message */}
          <div className="space-y-3">
            <h3 className="text-3xl font-bold text-white drop-shadow-lg">{gradeInfo.title}</h3>
            <p className="text-xl text-white/90 font-medium">{gradeInfo.message}</p>
          </div>
          
          {/* Score and Risk */}
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Star className={`h-5 w-5 fill-current ${gradeInfo.iconColor}`} />
              <span className={`font-semibold ${gradeInfo.scoreColor}`}>
                {analysis.healthScore}/100
              </span>
            </div>
            <div className={`flex items-center gap-2 ${riskLevelConfig[analysis.riskLevel].bgColor} backdrop-blur-sm rounded-full px-4 py-2`}>
              <RiskIcon className={`h-5 w-5 ${riskLevelConfig[analysis.riskLevel].color}`} />
              <span className="text-white/90 font-medium">
                Riesgo {riskLevelConfig[analysis.riskLevel].label}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-xl">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-full">
              <Info className="h-5 w-5 text-emerald-300" />
            </div>
            <h3 className="font-semibold text-white/90 text-lg">Resumen del Análisis</h3>
          </div>
          <p className="text-white/70 leading-relaxed text-base pl-11">{analysis.summary}</p>
        </div>
      </Card>

      {/* Warnings */}
      {analysis.warnings && analysis.warnings.length > 0 && (
        <Card className="p-6 bg-red-500/10 backdrop-blur-2xl border border-red-500/20 rounded-3xl shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-300" />
              </div>
              <h3 className="font-semibold text-white/90 text-lg">¿Por qué esta calificación?</h3>
            </div>
            <ul className="space-y-3 pl-11">
              {analysis.warnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-3 text-white/70">
                  <span className="text-red-400 mt-1 text-sm">⚠️</span>
                  <span className="text-sm leading-relaxed">{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* Benefits */}
      {analysis.benefits && analysis.benefits.length > 0 && (
        <Card className="p-6 bg-emerald-500/10 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-full">
                <CheckCircle className="h-5 w-5 text-emerald-300" />
              </div>
              <h3 className="font-semibold text-white/90 text-lg">Aspectos Positivos</h3>
            </div>
            <ul className="space-y-3 pl-11">
              {analysis.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3 text-white/70">
                  <span className="text-emerald-400 mt-1 text-sm">✅</span>
                  <span className="text-sm leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* Ingredients */}
      {analysis.ingredients && analysis.ingredients.length > 0 && (
        <Card className="p-6 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-xl">
          <div className="space-y-4">
            <h3 className="font-semibold text-white/90 text-lg">Ingredientes Detectados</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.ingredients.slice(0, 10).map((ingredient, index) => (
                <Badge 
                  key={index} 
                  className="bg-white/10 text-white/80 border-white/20 rounded-full px-3 py-1 text-xs"
                >
                  {ingredient}
                </Badge>
              ))}
              {analysis.ingredients.length > 10 && (
                <Badge className="bg-white/5 text-white/60 border-white/10 rounded-full px-3 py-1 text-xs">
                  +{analysis.ingredients.length - 10} más
                </Badge>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-4 pt-4">
        <Button 
          onClick={onScanAgain}
          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-2xl py-4 text-lg font-medium shadow-lg"
          size="lg"
        >
          <Camera className="mr-3 h-5 w-5" />
          Escanear Otro Producto
        </Button>
        <Button 
          variant="outline"
          onClick={onBack}
          className="w-full border border-white/20 text-white/80 hover:bg-white/10 backdrop-blur-xl bg-black/20 rounded-2xl py-4 text-lg font-medium"
        >
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
};

export default ProductGrader;
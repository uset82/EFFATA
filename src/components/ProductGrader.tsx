import { useState, useEffect } from "react";
import { ArrowLeft, Camera, AlertTriangle, CheckCircle, Info, Zap, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import type { IngredientAnalysis } from "@/lib/gemini";

interface ProductGraderProps {
  productData: string;
  onBack: () => void;
  onScanAgain: () => void;
}

type Grade = 'A' | 'B' | 'C' | 'D' | 'E';

interface GradeResult {
  grade: Grade;
  title: string;
  message: string;
  details: string[];
  color: string;
  icon: React.ReactNode;
}

const ProductGrader = ({ productData, onBack, onScanAgain }: ProductGraderProps) => {
  const [result, setResult] = useState<GradeResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<IngredientAnalysis | null>(null);
  
  const isMobile = useIsMobile();

  // Mock grading results based on Spanish "barrio" style
  const gradeResults: Record<Grade, GradeResult> = {
    'A': {
      grade: 'A',
      title: '¡Buenazo, causa!',
      message: 'Este producto está de pelos. Cómete eso tranqui, que está lleno de cosas buenas.',
      details: [
        'Ingredientes naturales de primera',
        'Sin químicos raros',
        'Bajo en azúcar y sal',
        'Rico en vitaminas y minerales'
      ],
      color: 'bg-grade-a text-white',
      icon: <CheckCircle className="h-8 w-8" />
    },
    'B': {
      grade: 'B',
      title: 'Está joya',
      message: 'No está mal, pana. Puedes comerlo sin culpa, pero tampoco todos los días.',
      details: [
        'Mayoría de ingredientes naturales',
        'Algunos aditivos menores',
        'Moderado en azúcar/sal',
        'Decente para consumo regular'
      ],
      color: 'bg-grade-b text-white',
      icon: <CheckCircle className="h-8 w-8" />
    },
    'C': {
      grade: 'C',
      title: 'Ahí no más...',
      message: 'Mira, no te va a matar, pero hay mejores opciones por ahí. De vez en cuando, dale.',
      details: [
        'Mezcla de ingredientes naturales y procesados',
        'Un poquito alto en azúcar o sal',
        'Algunos conservantes',
        'Mejor buscar alternativas'
      ],
      color: 'bg-grade-c text-black',
      icon: <AlertTriangle className="h-8 w-8" />
    },
    'D': {
      grade: 'D',
      title: 'Medio jodido...',
      message: 'Oe, esto no está muy bueno que digamos. Si lo comes, que sea rara vez, causa.',
      details: [
        'Muchos ingredientes procesados',
        'Alto en azúcar, sal o grasas malas',
        'Varios químicos y aditivos',
        'Mejor evítalo seguido'
      ],
      color: 'bg-grade-d text-white',
      icon: <AlertTriangle className="h-8 w-8" />
    },
    'E': {
      grade: 'E',
      title: '¡Ni lo mires!',
      message: 'Hermano, esto es una bomba. Puro químico y porquería. Mejor cómprate una fruta.',
      details: [
        'Puro procesado artificial',
        'Exceso de azúcar, sal y químicos',
        'Aditivos dañinos',
        'Ni para el perro, causa'
      ],
      color: 'bg-grade-e text-white',
      icon: <AlertTriangle className="h-8 w-8" />
    }
  };

  useEffect(() => {
    const processProduct = async () => {
      setIsLoading(true);
      
      try {
        const analysisData: IngredientAnalysis = JSON.parse(productData);
        setAnalysis(analysisData);
        
        const gradeData = gradeResults[analysisData.grade];
        
        const customizedResult: GradeResult = {
          ...gradeData,
          details: [
            ...analysisData.warnings.map(warning => `⚠️ ${warning}`),
            ...analysisData.benefits.map(benefit => `✅ ${benefit}`)
          ]
        };

        setResult(customizedResult);
      } catch (error) {
        console.error('Error parsing analysis data:', error);
        const grades: Grade[] = ['A', 'B', 'C', 'D', 'E'];
        const randomGrade = grades[Math.floor(Math.random() * grades.length)];
        setResult(gradeResults[randomGrade]);
      }
      
      setIsLoading(false);
    };

    processProduct();
  }, [productData]);

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Atrás
          </Button>
          <h2 className="text-lg font-bold">Analizando...</h2>
          <div className="w-16" />
        </div>

        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="animate-spin">
              <Zap className="h-12 w-12 mx-auto text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Revisando el producto...</h3>
              <p className="text-muted-foreground">
                Déjame ver qué onda con este producto, causa. Revisando ingredientes...
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="p-2 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Atrás
        </Button>
        <h2 className="text-lg font-bold">Resultado</h2>
        <div className="w-16" />
      </div>

      {/* Product Info */}
      {analysis?.productName && (
        <Card className="p-3 bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-5 w-5 text-primary" />
            <h4 className="font-bold">Producto</h4>
          </div>
          <p className="text-lg font-medium">{analysis.productName}</p>
          {analysis.barcode && (
            <p className="text-sm text-muted-foreground">Código: {analysis.barcode}</p>
          )}
        </Card>
      )}

      {/* Grade Display */}
      <Card className="overflow-hidden">
        <div className={`p-4 text-center ${result.color}`}>
          <div className="space-y-2">
            {result.icon}
            <div className="text-6xl font-black">{result.grade}</div>
            <h3 className="text-xl font-bold">{result.title}</h3>
            
            {/* Explicación de la categoría */}
            <div className="text-sm opacity-90 bg-black/10 rounded-lg p-2 mt-2">
              <div className="font-medium mb-1">Categoría {result.grade} de 5 niveles:</div>
              <div className="text-xs">
                {result.grade === 'A' && 'A = Excelente • B = Bueno • C = Regular • D = Malo • E = Muy malo'}
                {result.grade === 'B' && 'A = Excelente • B = Bueno • C = Regular • D = Malo • E = Muy malo'}
                {result.grade === 'C' && 'A = Excelente • B = Bueno • C = Regular • D = Malo • E = Muy malo'}
                {result.grade === 'D' && 'A = Excelente • B = Bueno • C = Regular • D = Malo • E = Muy malo'}
                {result.grade === 'E' && 'A = Excelente • B = Bueno • C = Regular • D = Malo • E = Muy malo'}
              </div>
            </div>

            {analysis && (
              <div className="bg-black/10 rounded-lg p-2 mt-2">
                <div className="text-base font-medium">
                  Puntuación: {analysis.healthScore}/100
                </div>
                <div className="text-xs opacity-90 mt-1">
                  {analysis.healthScore >= 80 && 'Muy saludable - Consume sin preocupación'}
                  {analysis.healthScore >= 60 && analysis.healthScore < 80 && 'Moderadamente saludable - Consumo ocasional'}
                  {analysis.healthScore >= 40 && analysis.healthScore < 60 && 'Poco saludable - Limita su consumo'}
                  {analysis.healthScore < 40 && 'Nada saludable - Evita este producto'}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Message */}
      <Card className="p-3">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-base leading-relaxed">{result.message}</p>
        </div>
      </Card>

      {/* Details */}
      <Card className="p-3">
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          ¿Por qué esta calificación?
        </h4>
        <div className="space-y-2">
          {result.details.map((detail, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                result.grade <= 'B' ? 'bg-green-500' : 
                result.grade === 'C' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <p className="text-sm">{detail}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-3 pt-1">
        <Button onClick={onScanAgain} className="w-full font-bold">
          <Camera className="mr-2 h-5 w-5" />
          Escanear Otro Producto
        </Button>
        <Button variant="outline" onClick={onBack} className="w-full">
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
};

export default ProductGrader;
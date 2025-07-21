const GEMINI_API_KEY = "AIzaSyCD1KP9my6r4TNLc667MlCzAk9Vm_VemPo";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

export interface IngredientAnalysis {
  ingredients: string[];
  productName?: string;
  barcode?: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  healthScore: number;
  warnings: string[];
  benefits: string[];
}

export const analyzeProductImage = async (imageData: string, mode: 'barcode' | 'ingredients'): Promise<IngredientAnalysis> => {
  try {
    const prompt = mode === 'barcode' 
      ? `Analiza esta imagen que contiene un código de barras de un producto alimenticio. Si puedes ver el código de barras, extráelo. También analiza cualquier información del producto visible en el empaque (nombre, ingredientes, información nutricional). 

Responde en formato JSON con:
- productName: nombre del producto si es visible
- barcode: código de barras si lo puedes leer
- ingredients: lista de ingredientes visible en el empaque
- grade: calificación de A (excelente) a E (malo) basado en la calidad nutricional
- healthScore: puntuación de 1-100
- warnings: advertencias sobre ingredientes problemáticos
- benefits: beneficios nutricionales si los hay

Usa un tono casual y directo como si fueras de barrio peruano.`

      : `Analiza esta imagen que contiene la lista de ingredientes de un producto alimenticio. Lee cuidadosamente todos los ingredientes listados.

Responde en formato JSON con:
- ingredients: lista completa de ingredientes que puedes leer en la imagen
- grade: calificación de A (excelente) a E (malo) basado en:
  * A: Ingredientes naturales, mínimo procesamiento, sin aditivos dañinos
  * B: Mayoría naturales con algunos aditivos menores
  * C: Mezcla de naturales y procesados, moderado en azúcar/sal
  * D: Muchos procesados, alto en azúcar/sal/grasas trans
  * E: Altamente procesado, muchos químicos y aditivos dañinos
- healthScore: puntuación de 1-100 basada en calidad nutricional
- warnings: ingredientes problemáticos encontrados (azúcares añadidos, grasas trans, conservantes dañinos, etc.)
- benefits: ingredientes beneficiosos si los hay (vitaminas, minerales, fibra, etc.)

Usa un tono casual y directo como si fueras de barrio peruano.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: prompt
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageData.split(',')[1] // Remove data:image/jpeg;base64, prefix
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from Gemini API');
    }

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    // Ensure required fields exist
    return {
      ingredients: analysis.ingredients || [],
      productName: analysis.productName,
      barcode: analysis.barcode,
      grade: analysis.grade || 'C',
      healthScore: analysis.healthScore || 50,
      warnings: analysis.warnings || [],
      benefits: analysis.benefits || [],
    };

  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('No pude analizar la imagen, causa. ¿Está clara la foto?');
  }
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
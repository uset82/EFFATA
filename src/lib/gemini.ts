const GEMINI_API_KEY = "AIzaSyBaGTBUdz89CJ9SbLIp40nZTY10IaJBQrE";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export interface IngredientAnalysis {
  ingredients: string[];
  productName?: string;
  barcode?: string;
  productType: 'Food' | 'Makeup' | 'Cream' | 'Oil' | 'Toothpaste' | 'Other';
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  healthScore: number;
  warnings: string[];
  benefits: string[];
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  summary: string;
}

export const analyzeProductImage = async (imageData: string, mode: 'barcode' | 'ingredients'): Promise<IngredientAnalysis> => {
  try {
    const prompt = mode === 'barcode' 
      ? `Eres EFFATA, la IA más avanzada del mundo para análisis de salud y seguridad de productos. Analiza esta imagen de producto con código de barras usando las capacidades de Gemini 2.5 Flash.

PROTOCOLO DE ANÁLISIS AVANZADO EFFATA:
1. RECONOCIMIENTO VISUAL: Extrae código de barras, nombre del producto, marca y tipo
2. EXTRACCIÓN DE INGREDIENTES: Lee todo el texto visible incluyendo ingredientes, nombres INCI, información nutricional
3. ANÁLISIS INTEGRAL DE SEGURIDAD:
   - Consulta base de datos de carcinógenos IARC (Grupos 1, 2A, 2B)
   - Verifica alertas de seguridad EU RAPEX y sustancias prohibidas
   - Confirma estado regulatorio FDA/Health Canada/EFSA
   - Evalúa potencial de disrupción endocrina (screening EDC)
   - Analiza riesgos de alérgenos y sensibilización
   - Examina estudios toxicológicos e investigación revisada por pares

4. CATEGORIZACIÓN DE PRODUCTOS:
   - Alimentos/Bebidas: Números E, aditivos, conservantes, edulcorantes
   - Cosméticos/Maquillaje: Ingredientes INCI, colorantes, parabenos, liberadores de formaldehído
   - Cuidado Personal: Emulsionantes, surfactantes, extractos botánicos, aceites esenciales
   - Cuidado Bucal: Fluoruros, SLS/SLES, agentes blanqueadores, antimicrobianos

5. SISTEMA DE CALIFICACIÓN AVANZADO:
   - A (😍 90-100): Ingredientes naturales premium, cero preocupaciones de seguridad
   - B (😊 70-89): Mayormente seguro, procesamiento menor, ingredientes bien estudiados
   - C (😐 50-69): Perfil mixto, algunas preocupaciones, procesamiento moderado
   - D (😟 30-49): Múltiples señales de alerta, alto procesamiento, aditivos preocupantes
   - E (🤢 0-29): Ingredientes peligrosos, sustancias prohibidas, evitar completamente

6. ESTRATIFICACIÓN DE RIESGOS:
   - Crítico: Carcinógenos probados, sustancias prohibidas, toxicidad severa
   - Alto: Carcinógenos probables, alérgenos fuertes, disruptores hormonales
   - Moderado: Posibles irritantes, ingredientes controvertidos, datos limitados
   - Bajo: Estado GRAS, ingredientes naturales, datos extensos de seguridad

Proporciona análisis JSON detallado:
{
  "productName": "nombre exacto del producto del empaque",
  "barcode": "número completo del código de barras si es visible",
  "productType": "Food|Makeup|Cream|Oil|Toothpaste|Other",
  "ingredients": ["lista completa de ingredientes extraídos"],
  "grade": "A|B|C|D|E",
  "healthScore": 1-100,
  "riskLevel": "Low|Moderate|High|Critical",
  "summary": "Evaluación profesional de seguridad en 2-3 oraciones",
  "warnings": ["preocupaciones específicas de seguridad con base científica"],
  "benefits": ["aspectos positivos de salud e ingredientes seguros"]
}`

      : `Eres el motor avanzado de análisis de ingredientes de EFFATA impulsado por Gemini 2.5 Flash. Realiza una evaluación integral de seguridad de estos ingredientes.

PROTOCOLO DE ANÁLISIS AVANZADO DE INGREDIENTES:

1. IDENTIFICACIÓN DE INGREDIENTES:
   - Extrae TODOS los nombres de ingredientes visibles (INCI, nombres comunes, nombres químicos)
   - Identifica concentraciones si están listadas
   - Reconoce categoría del producto por perfil de ingredientes

2. EVALUACIÓN TOXICOLÓGICA:
   - Clasificaciones de carcinogenicidad IARC (Grupo 1, 2A, 2B, 3)
   - Clasificaciones de peligro EU CLP (declaraciones H)
   - Predicciones de toxicidad OECD QSAR
   - Toxicidad reproductiva/del desarrollo (estudios DART)
   - Potencial de sensibilización cutánea (datos LLNA, h-CLAT)
   - Screening de disrupción endocrina (OECD TG 440-456)

3. CUMPLIMIENTO REGULATORIO:
   - Restricciones del Reglamento de Cosméticos EU (EC) No 1223/2009
   - Estado de aditivo alimentario FDA CFR Título 21
   - Lista de Ingredientes Cosméticos de Health Canada
   - Lista de carcinógenos California Prop 65
   - Restricciones de sustancias REACH

4. DETECCIÓN DE TIPO DE PRODUCTO:
   - Alimentos: Números E (E100-E1999), FEMA GRAS, aditivos alimentarios
   - Cosméticos: Base de datos INCI, colorantes (números CI), conservantes
   - Cuidado Personal: Surfactantes, emulsionantes, humectantes, extractos botánicos
   - Cuidado Bucal: Compuestos de fluoruro, abrasivos, antimicrobianos

5. PUNTUACIÓN BASADA EN EVIDENCIA:
   - Estudios de toxicología revisados por pares
   - Datos epidemiológicos
   - Estudios de seguridad in vitro/in vivo
   - Reportes de eventos adversos del mundo real
   - Evaluaciones de paneles de expertos (CIR, SCCS)

6. EVALUACIÓN HOLÍSTICA DE RIESGOS:
   - Consideraciones de exposición acumulativa
   - Riesgos de poblaciones vulnerables (niños, mujeres embarazadas)
   - Potencial de interacción entre ingredientes
   - Factores de bioacumulación y persistencia

Proporciona análisis JSON integral:
{
  "ingredients": ["lista completa de ingredientes extraídos"],
  "productType": "Food|Makeup|Cream|Oil|Toothpaste|Other",
  "grade": "A|B|C|D|E",
  "healthScore": 1-100,
  "riskLevel": "Low|Moderate|High|Critical",
  "summary": "Evaluación de seguridad basada en evidencia en 2-3 oraciones",
  "warnings": ["riesgos específicos con referencias científicas"],
  "benefits": ["ingredientes beneficiosos y sus propiedades"]
}`;

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
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
          responseMimeType: "application/json"
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de API Gemini:', response.status, errorText);
      throw new Error(`Error de API Gemini 2.5 Flash: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Respuesta de API Gemini:', data);
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('Sin texto en respuesta:', data);
      throw new Error('Sin respuesta de la API Gemini 2.5 Flash');
    }

    // Parse JSON response with enhanced error handling
    let analysis;
    try {
      // Try direct JSON parse first (with responseMimeType: "application/json")
      analysis = JSON.parse(text);
    } catch (parseError) {
      console.error('Error de análisis JSON:', parseError, 'Texto crudo:', text);
      // Fallback: extract JSON from text response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No se encontró JSON válido en la respuesta de Gemini 2.5 Flash');
      }
      try {
        analysis = JSON.parse(jsonMatch[0]);
      } catch (fallbackError) {
        console.error('Error de análisis JSON de respaldo:', fallbackError);
        throw new Error('No se pudo analizar la respuesta de Gemini 2.5 Flash');
      }
    }
    
    // Ensure required fields exist with EFFATA defaults
    return {
      ingredients: analysis.ingredients || [],
      productName: analysis.productName,
      barcode: analysis.barcode,
      productType: analysis.productType || 'Other',
      grade: analysis.grade || 'C',
      healthScore: Math.min(100, Math.max(0, analysis.healthScore || 50)),
      riskLevel: analysis.riskLevel || 'Moderate',
      summary: analysis.summary || 'Análisis de seguridad del producto completado usando IA avanzada.',
      warnings: Array.isArray(analysis.warnings) ? analysis.warnings : [],
      benefits: Array.isArray(analysis.benefits) ? analysis.benefits : [],
    };

  } catch (error) {
    console.error('Error con análisis de Gemini 2.5 Flash:', error);
    throw new Error('No se pudo analizar la imagen con IA avanzada. Por favor asegúrate de que la foto esté clara e inténtalo de nuevo.');
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
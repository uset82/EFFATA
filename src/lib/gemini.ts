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
  console.log('🔍 EFFATA: Iniciando análisis de imagen...', { mode, imageSize: imageData.length });
  
  try {
    // Validate image data
    if (!imageData || !imageData.includes('data:image')) {
      console.error('❌ Datos de imagen inválidos');
      throw new Error('Datos de imagen inválidos');
    }

    const prompt = mode === 'barcode' 
      ? `Eres EFFATA, la inteligencia artificial más avanzada del mundo para análisis de salud y seguridad de productos. Analiza esta imagen de producto con código de barras utilizando las capacidades de Gemini 2.5 Flash.

IMPORTANTE: Responde ÚNICAMENTE en español de España, con un lenguaje educado, profesional y técnico apropiado para consumidores españoles.

PROTOCOLO DE ANÁLISIS AVANZADO EFFATA:

1. RECONOCIMIENTO VISUAL COMPLETO:
   - Extrae código de barras, nombre del producto, marca y tipo
   - Lee TODOS los ingredientes visibles en la etiqueta
   - Identifica información nutricional y advertencias

2. ANÁLISIS INTEGRAL DE SEGURIDAD:
   - Consulta base de datos de carcinógenos IARC (Grupos 1, 2A, 2B)
   - Verifica alertas de seguridad EU RAPEX y sustancias prohibidas
   - Confirma estado regulatorio FDA/Health Canada/EFSA
   - Evalúa potencial de disrupción endocrina
   - Analiza riesgos de alérgenos y sensibilización

3. CATEGORIZACIÓN DE PRODUCTOS:
   - Alimentos/Bebidas: Números E, aditivos, conservantes, edulcorantes
   - Cosméticos/Maquillaje: Ingredientes INCI, colorantes, parabenos
   - Cuidado Personal: Emulsionantes, surfactantes, extractos botánicos
   - Cuidado Bucal: Fluoruros, SLS/SLES, agentes blanqueadores

4. SISTEMA DE CALIFICACIÓN AVANZADO:
   - A (😍 90-100): Ingredientes naturales premium, sin preocupaciones de seguridad
   - B (😊 70-89): Mayormente seguro, procesamiento mínimo
   - C (😐 50-69): Perfil mixto, algunas preocupaciones
   - D (😟 30-49): Múltiples señales de alerta, alto procesamiento
   - E (🤢 0-29): Ingredientes peligrosos, evitar completamente

5. EVALUACIÓN DE RIESGOS:
   - Crítico: Carcinógenos probados, sustancias prohibidas
   - Alto: Carcinógenos probables, disruptores hormonales
   - Moderado: Posibles irritantes, ingredientes controvertidos
   - Bajo: Estado GRAS, ingredientes naturales

RESPONDE ÚNICAMENTE CON JSON VÁLIDO EN ESPAÑOL DE ESPAÑA:
{
  "productName": "nombre exacto del producto del envase",
  "barcode": "número completo del código de barras si es visible",
  "productType": "Food|Makeup|Cream|Oil|Toothpaste|Other",
  "ingredients": ["lista completa de ingredientes extraídos de la etiqueta"],
  "grade": "A|B|C|D|E",
  "healthScore": 85,
  "riskLevel": "Low|Moderate|High|Critical",
  "summary": "Evaluación profesional detallada de seguridad en español de España, explicando los principales hallazgos con lenguaje técnico pero accesible",
  "warnings": ["preocupaciones específicas de seguridad con base científica, mencionando nombres de ingredientes problemáticos en español"],
  "benefits": ["aspectos positivos para la salud e ingredientes seguros identificados, explicados en español educado"]
}`

      : `Eres el motor avanzado de análisis de ingredientes de EFFATA impulsado por Gemini 2.5 Flash. Realiza una evaluación integral de seguridad de estos ingredientes.

IMPORTANTE: Responde ÚNICAMENTE en español de España, con un lenguaje educado, profesional y técnico apropiado para consumidores españoles.

PROTOCOLO DE ANÁLISIS AVANZADO DE INGREDIENTES:

1. IDENTIFICACIÓN COMPLETA:
   - Extrae TODOS los nombres de ingredientes visibles
   - Identifica concentraciones si están listadas
   - Reconoce categoría del producto por perfil de ingredientes

2. EVALUACIÓN TOXICOLÓGICA PROFUNDA:
   - Clasificaciones de carcinogenicidad IARC (Grupo 1, 2A, 2B, 3)
   - Clasificaciones de peligro EU CLP (declaraciones H)
   - Toxicidad reproductiva/del desarrollo
   - Potencial de sensibilización cutánea
   - Screening de disrupción endocrina

3. CUMPLIMIENTO REGULATORIO:
   - Restricciones del Reglamento de Cosméticos EU
   - Estado de aditivo alimentario FDA
   - Lista de carcinógenos California Prop 65
   - Restricciones de sustancias REACH

4. DETECCIÓN INTELIGENTE DE TIPO:
   - Alimentos: Números E, FEMA GRAS, aditivos alimentarios
   - Cosméticos: Base de datos INCI, colorantes CI, conservantes
   - Cuidado Personal: Surfactantes, emulsionantes, humectantes
   - Cuidado Bucal: Compuestos de fluoruro, abrasivos

5. PUNTUACIÓN BASADA EN EVIDENCIA:
   - Estudios de toxicología revisados por pares
   - Datos epidemiológicos
   - Estudios de seguridad in vitro/in vivo
   - Reportes de eventos adversos del mundo real

RESPONDE ÚNICAMENTE CON JSON VÁLIDO EN ESPAÑOL DE ESPAÑA:
{
  "ingredients": ["lista completa de ingredientes extraídos"],
  "productType": "Food|Makeup|Cream|Oil|Toothpaste|Other",
  "grade": "A|B|C|D|E",
  "healthScore": 75,
  "riskLevel": "Low|Moderate|High|Critical",
  "summary": "Evaluación detallada de seguridad basada en evidencia en español de España, explicando los principales riesgos y beneficios con lenguaje técnico pero comprensible",
  "warnings": ["riesgos específicos con referencias científicas y nombres de ingredientes problemáticos, explicados en español educado"],
  "benefits": ["ingredientes beneficiosos y sus propiedades específicas para la salud, descritos en español profesional"]
}`;

    console.log('📡 Enviando solicitud a Gemini API...');

    const requestBody = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: imageData.split(',')[1]
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
        responseMimeType: "application/json"
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH"
        }
      ]
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Respuesta recibida:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error de API Gemini:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      if (response.status === 400) {
        throw new Error('Imagen no válida o muy grande. Intenta con una imagen más pequeña y clara.');
      } else if (response.status === 403) {
        throw new Error('Error de permisos de API. Contacta al soporte técnico.');
      } else if (response.status === 429) {
        throw new Error('Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.');
      } else if (response.status >= 500) {
        throw new Error('Servicio temporalmente no disponible. Inténtalo de nuevo en unos minutos.');
      }
      
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Datos recibidos de Gemini:', data);
    
    if (data.error) {
      console.error('❌ Error en respuesta de API:', data.error);
      throw new Error(`Error de API: ${data.error.message || 'Error desconocido'}`);
    }

    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      console.warn('⚠️ Contenido bloqueado por filtros de seguridad');
      throw new Error('Imagen bloqueada por filtros de seguridad. Intenta con otra imagen.');
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('❌ Sin texto en respuesta:', data);
      throw new Error('Respuesta vacía de la API');
    }

    console.log('📝 Texto de respuesta recibido:', text.substring(0, 500) + '...');

    // Parse JSON response with multiple strategies
    let analysis;
    try {
      analysis = JSON.parse(text);
      console.log('✅ JSON parseado exitosamente');
    } catch (parseError) {
      console.warn('⚠️ Error en parseo directo, intentando extraer JSON...', parseError);
      
      // Try to extract JSON from code blocks or find JSON pattern
      const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (codeBlockMatch) {
        analysis = JSON.parse(codeBlockMatch[1]);
        console.log('✅ JSON extraído de code block');
      } else if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        console.log('✅ JSON extraído con regex');
      } else {
        console.error('❌ No se encontró JSON válido en:', text);
        throw new Error('No se encontró JSON válido en la respuesta');
      }
    }
    
    console.log('🔍 Análisis parseado:', analysis);

    // Validate and return sanitized analysis
    const sanitizedAnalysis: IngredientAnalysis = {
      ingredients: Array.isArray(analysis.ingredients) ? analysis.ingredients : ['Ingredientes no detectados'],
      productName: typeof analysis.productName === 'string' ? analysis.productName : 'Producto no identificado',
      barcode: typeof analysis.barcode === 'string' ? analysis.barcode : undefined,
      productType: ['Food', 'Makeup', 'Cream', 'Oil', 'Toothpaste', 'Other'].includes(analysis.productType) 
        ? analysis.productType : 'Other',
      grade: ['A', 'B', 'C', 'D', 'E'].includes(analysis.grade) ? analysis.grade : 'C',
      healthScore: Math.min(100, Math.max(0, Number(analysis.healthScore) || 50)),
      riskLevel: ['Low', 'Moderate', 'High', 'Critical'].includes(analysis.riskLevel) 
        ? analysis.riskLevel : 'Moderate',
      summary: typeof analysis.summary === 'string' && analysis.summary.length > 10 
        ? analysis.summary 
        : 'Análisis de seguridad del producto completado utilizando inteligencia artificial avanzada EFFATA.',
      warnings: Array.isArray(analysis.warnings) ? analysis.warnings : ['No se pudieron identificar advertencias específicas'],
      benefits: Array.isArray(analysis.benefits) ? analysis.benefits : ['Consulte con un profesional sanitario para obtener más información'],
    };

    console.log('✅ EFFATA: Análisis completado exitosamente:', sanitizedAnalysis);
    return sanitizedAnalysis;

  } catch (error: any) {
    console.error('❌ EFFATA: Error en análisis:', error);
    
    // Instead of fallback, throw the error to show proper error message
    throw new Error(`Error analizando la imagen: ${error.message}. Por favor asegúrese de que la imagen sea clara e inténtelo de nuevo.`);
  }
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      console.log('📁 Archivo convertido a base64:', file.name, file.size, 'bytes');
      resolve(result);
    };
    reader.onerror = (error) => {
      console.error('❌ Error convirtiendo archivo:', error);
      reject(new Error('Error leyendo el archivo'));
    };
    reader.readAsDataURL(file);
  });
};
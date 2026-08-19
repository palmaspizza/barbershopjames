exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const bodyReq = JSON.parse(event.body);
    const imagenBase64 = bodyReq.imagen;
    const apiKey = process.env.GEMINI_API_KEY; // La que guardaste en Netlify

    // Tu prompt exacto
    const prompt = `Analiza este comprobante bancario chileno y extrae los datos exactos. Si algún dato no es 100% legible, asigna esValido: false.`;

    // Tu configuración exacta
    const geminiBody = {
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: 'image/jpeg', data: imagenBase64 } }
        ]
      }],
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            esValido: { type: 'BOOLEAN' },
            monto: { type: 'NUMBER' },
            fecha: { type: 'STRING' },
            numeroOperacion: { type: 'STRING' },
            banco: { type: 'STRING' },
            destinatario: { type: 'STRING' },
            rut: { type: 'STRING' },
            confianza: { type: 'STRING', enum: ['alta', 'media', 'baja'] }
          },
          required: ['esValido', 'monto', 'fecha', 'numeroOperacion', 'banco', 'destinatario', 'rut', 'confianza']
        }
      }
    };

    // Apuntamos a tu versión 3.6-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    });

    if (!res.ok) {
      const err = await res.json();
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Gemini API error: ' + (err.error?.message || res.status) }) 
      };
    }

    const data = await res.json();
    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!texto) {
      const finishReason = data.candidates?.[0]?.finishReason;
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: `Gemini no devolvió texto. Razón: ${finishReason || 'Desconocida'}` }) 
      };
    }

    // Como usaste responseSchema, "texto" ya es un string JSON perfecto.
    // Lo devolvemos directo al frontend con status 200.
    return {
      statusCode: 200,
      body: texto 
    };

  } catch (error) {
    console.error('Error en Netlify Function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno en el servidor' })
    };
  }
};
import { GoogleGenAI, Type } from "@google/genai";
import { SimulationResult, UserInput } from '../types';

const getAiClient = () => {
  if (!process.env.API_KEY) throw new Error("API Key is missing");
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getCoordinatesFromAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
  try {
    const ai = getAiClient();
    const prompt = `Give me the latitude and longitude for this address: "${address}". 
    If the address is vague, find the center of the city/street.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{googleMaps: {}}], 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lat: { type: Type.NUMBER },
            lng: { type: Type.NUMBER }
          },
          required: ['lat', 'lng']
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      if (data.lat && data.lng) {
        return { lat: data.lat, lng: data.lng };
      }
    }
    return null;
  } catch (error) {
    console.error("Geocoding error with Gemini:", error);
    return null;
  }
};

export const generateExpertAnalysis = async (input: UserInput, result: SimulationResult, solarApiUsed: boolean): Promise<string> => {
  try {
    const ai = getAiClient();

    const profileLabel = input.userProfile === 'home_office' ? "Présent/Télétravail" : "Actif (Absent journée)";
    const equipments = [];
    if (input.hasElectricVehicle) equipments.push(`VE (${input.electricVehicleKm} km/an)`);
    if (input.hasHeatPump) equipments.push("Pompe à Chaleur");
    if (input.hasSwimmingPool) equipments.push("Piscine");
    
    const equipString = equipments.length > 0 ? equipments.join(", ") : "Standard";
    
    const prompt = `
    Tu es un ingénieur expert en solutions photovoltaïques hybrides pour Horizon-Energie.be (Wallonie).
    
    Contexte Technique :
    Nous utilisons des modules de batterie optimisés de **6 kWh ou 10 kWh**.
    Les configurations sont toujours des multiples de ces unités (ex: 12kWh, 18kWh, 30kWh).
    L'onduleur est dimensionné pour maximiser l'autoconsommation et la résilience hivernale.
    Les panneaux sont sur-dimensionnés (Trina Solar Vertex S+).

    Données Client :
    - Conso : ${input.annualConsumption} kWh/an
    - Profil : ${profileLabel}
    - Équipements : ${equipString}
    - Toiture : ${input.roofArea}m²
    
    Résultat Simulation :
    - Kit : ${result.numberOfPanels}x Panneaux (${result.systemSizeKwp} kWc)
    - Stockage : Batterie Haute Performance ${result.batteryCapacityKwh} kWh + Onduleur ${result.inverterKva} kVA
    - Autoconsommation : ${result.selfConsumptionRate}%
    - ROI : ${result.paybackPeriod} ans
    
    Consignes :
    1. Valide la configuration technique (ex: "Le choix de ${result.batteryCapacityKwh} kWh est optimal pour votre profil...").
    2. Explique brièvement l'avantage de cette capacité pour couvrir les besoins nocturnes et les pics de consommation.
    3. Souligne la rentabilité grâce à l'autoconsommation élevée.
    4. Ton : Expert, rassurant, orienté solution. Court (max 100 mots).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Analyse en cours...";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "L'analyse experte est temporairement indisponible.";
  }
};
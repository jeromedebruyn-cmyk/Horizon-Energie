import { SolarApiResponse } from '../types';

const SOLAR_API_BASE_URL = 'https://solar.googleapis.com/v1/buildingInsights:findClosest';

export const fetchSolarData = async (lat: number, lng: number): Promise<SolarApiResponse | null> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing for Solar API");
    return null;
  }

  try {
    const url = `${SOLAR_API_BASE_URL}?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${process.env.API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn("Solar API: No data found for this location.");
      } else if (response.status === 403) {
        console.warn("Solar API: Access denied. Ensure the API key has Solar API enabled.");
      } else {
        console.warn(`Solar API Error: ${response.status} ${response.statusText}`);
      }
      return null;
    }

    const data: SolarApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Solar API data:", error);
    return null;
  }
};
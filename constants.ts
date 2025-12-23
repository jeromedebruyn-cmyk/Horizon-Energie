
import { CardinalDirection } from './types';

// Hardware Specs
export const PANEL_POWER_W = 450; // Trina Solar Vertex S+
export const PANEL_AREA_M2 = 2.0; // Approx 1.8m² + margins for installation
export const BATTERY_UNIT_COST = 600; // €/kWh (SigenStor)
export const MAINTENANCE_COST = 100; // €/an

// Production Factors (kWh/kWp) per Direction (Wallonia/Brussels estimates)
// Using 1000 avg for calculations as requested in prompt, but keeping directional nuance for weighting
export const DIRECTION_FACTORS: Record<CardinalDirection, number> = {
  'S': 1050,
  'SE': 1000,
  'SW': 1000,
  'E': 900,
  'W': 900,
  'NE': 800,
  'NW': 800,
  'N': 700
};

export const BASE_PRODUCTION_FACTOR = 1000; // Fixed average for BE calculation

// Energy Prices (Wallonie 2025)
export const PRICE_BUY_KWH = 0.35; // €/kWh (Savings)
export const PRICE_SELL_KWH = 0.03; // €/kWh (Injection - Low)

// CAPEX Rules for Panels (Installé) - New Winter Strategy Pricing
export const getPanelPricePerKwp = (kwp: number): number => {
  if (kwp <= 6) return 850;
  if (kwp <= 10) return 800;
  return 750; // > 10 kWp
};

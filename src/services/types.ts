// Shared types
export interface FlightBase {
  flightType: string;
  origin: string;
  destination: string;
  departureDate: string;
  radiativeFactor: boolean;
}

// Past flights specific
export interface PastFlight extends FlightBase {
  operatingCarrierCode: string;
  flightNumber: string;
  class: string;
  travelers: number;
}

// Future flights specific
export interface FutureFlight extends FlightBase {
  estimatedEmissions?: number;
}

// API Response types
export interface FlightEmissions {
  economy: number;
  premium_economy: number;
  business: number;
  first: number;
}

export interface RouteDetail {
  origin: string;
  destination: string;
  operatingCarrierCode: string;
  flightNumber: number;
  departureDate: {
    year: number;
    month: number;
    day: number;
  };
  travelers: number;
  date: string;
  found: boolean;
  emissions: FlightEmissions;
}

export interface EmissionsResponse {
  total_emissions: number;
  total_distance: number;
  per_passenger: number;
  without_ir: number;
  route_details: RouteDetail[];
}

export interface FutureFlightData {
  origin: string;
  destination: string;
  operatingCarrierCode: string;
  flightNumber: string;
  departureDate: string;
  radiativeFactor: boolean;
  travelers: number;
}

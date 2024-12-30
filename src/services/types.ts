// Shared types
export interface FlightBase {
  flightType: string;
  origin: string;
  destination: string;
  departureDate: string;
  radiativeFactor: boolean;
}

export interface FlightDetails {
  flightNumber: string;
  origin: string;
  destination: string;
  operatingCarrierCode: string;
  departureDate: string;
  class: string;
}

// Form Types
export interface FormInputData {
  flightType: string;
  from: string;
  via: string;
  destination: string;
  cabinClass: string;
  travelers: number;
  radiativeFactor: boolean;
  departureDate: string;
}

export interface FutureFlightData {
  origin: string;
  destination: string;
  operatingCarrierCode: string;
  flightNumber: string;
  departureDate: string;
  radiativeFactor: boolean;
  travelers: number;
  class: string;
  estimatedEmissions?: number;
}

// API Response Types
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

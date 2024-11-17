import axios from 'axios';

const API_BASE_URL = 'https://flights-by-scope321.replit.app/api/v1/';

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
  flightNumber: string;
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

export interface EmissionsRequest {
  class: string;
  departureDate: string;
  ir_factor: boolean;
  return: boolean;
  route: string[];
  travelers: number;
}

export interface EmissionsResponse {
  total_emissions: number;
  total_distance: number;
  per_passenger: number;
  without_ir: number;
  route_details: RouteDetail[];
}

const validateRequest = (data: EmissionsRequest): string | null => {
  if (!data.route || data.route.length < 2) {
    return 'At least origin and destination airports are required';
  }
  if (!data.departureDate) {
    return 'Departure date is required';
  }
  if (data.travelers < 1) {
    return 'Number of travelers must be at least 1';
  }
  return null;
};

export const calculateEmissions = async (data: EmissionsRequest): Promise<EmissionsResponse> => {
  try {
    const validationError = validateRequest(data);
    if (validationError) {
      throw new Error(validationError);
    }

    // Filter out empty strings from route array
    const cleanedData = {
      ...data,
      route: data.route.filter(Boolean)
    };

    console.log('Request payload:', JSON.stringify(cleanedData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/calculate-emissions`, cleanedData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message || error.message
      });
      throw new Error(
        error.response?.data?.message || 
        'Failed to calculate emissions. Please check your input and try again.'
      );
    }
    throw error;
  }
};
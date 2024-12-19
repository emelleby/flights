import axios from 'axios';
import { PastFlight, EmissionsResponse } from './types';

const API_BASE_URL = 'https://flights-by-scope321.replit.app/api/v1';

interface EmissionsRequest {
  class: string;
  departureDate: string;
  ir_factor: boolean;
  return: boolean;
  route: string[];
  travelers: number;
}

const validateRequest = (data: PastFlight): string | null => {
  if (!data.origin || !data.destination) {
    return 'Origin and destination airports are required';
  }
  if (!data.departureDate) {
    return 'Departure date is required';
  }
  if (!data.travelers || data.travelers < 1) {
    return 'Number of travelers must be at least 1';
  }
  return null;
};

export const calculateEmissions = async (data: PastFlight): Promise<EmissionsResponse> => {
  try {
    const validationError = validateRequest(data);
    if (validationError) {
      throw new Error(validationError);
    }

    const requestData: EmissionsRequest = {
      class: data.class,
      departureDate: data.departureDate,
      ir_factor: data.radiativeFactor,
      return: data.flightType.toLowerCase() === 'return',
      route: [data.origin, data.destination].filter(Boolean),
      travelers: data.travelers
    };

    const response = await axios.post(`${API_BASE_URL}/calculate-emissions`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to calculate emissions');
    }
    throw error;
  }
};

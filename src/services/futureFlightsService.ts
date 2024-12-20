import axios from 'axios';

const TRAVEL_API_URL = 'https://travelimpactmodel.googleapis.com/v1/flights:computeFlightEmissions';
const TRAVEL_API_KEY = import.meta.env.VITE_GOOGLE_TRAVEL_API_KEY;

if (!TRAVEL_API_KEY) {
  console.error('Missing VITE_GOOGLE_TRAVEL_API_KEY environment variable');
}

interface DateComponents {
  year: number;
  month: number;
  day: number;
}

interface FlightRequest {
  origin: string;
  destination: string;
  operatingCarrierCode: string;
  flightNumber: number;
  departureDate: DateComponents;
}

interface TravelAPIRequest {
  flights: FlightRequest[];
}

interface FlightDetails {
  origin: string;
  destination: string;
  operatingCarrierCode: string;
  flightNumber: number;
  departureDate: DateComponents;
}

interface EmissionsPerClass {
  first: number;
  business: number;
  premiumEconomy: number;
  economy: number;
}

export interface FlightEmissionResult {
  flight: FlightDetails;
  emissionsGramsPerPax: EmissionsPerClass;
}

interface ModelVersion {
  major: number;
  minor: number;
  patch: number;
  dated: string;
}

interface TravelAPIResponse {
  flightEmissions: FlightEmissionResult[];
  modelVersion: ModelVersion;
}

export const submitFutureFlight = async (
  flightData: {
    origin: string;
    destination: string;
    operatingCarrierCode: string;
    flightNumber: string;
    departureDate: string;
  }
): Promise<FlightEmissionResult> => {
  if (!TRAVEL_API_KEY) {
    throw new Error('Google Travel API key is not configured. Please set VITE_GOOGLE_TRAVEL_API_KEY in your environment variables.');
  }

  try {
    // Convert date string to components
    const date = new Date(flightData.departureDate);
    const dateComponents: DateComponents = {
      year: date.getFullYear(),
      month: date.getMonth() + 1, // JavaScript months are 0-based
      day: date.getDate()
    };

    const requestData: TravelAPIRequest = {
      flights: [
        {
          origin: flightData.origin.toUpperCase(),
          destination: flightData.destination.toUpperCase(),
          operatingCarrierCode: flightData.operatingCarrierCode.toUpperCase(),
          flightNumber: parseInt(flightData.flightNumber, 10),
          departureDate: dateComponents
        }
      ]
    };

    console.log('Sending request:', requestData);

    const response = await axios.post<TravelAPIResponse>(
      `${TRAVEL_API_URL}?key=${TRAVEL_API_KEY}`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('API Response:', response.data);

    if (!response.data.flightEmissions || response.data.flightEmissions.length === 0) {
      throw new Error('No flight emissions data returned from the API');
    }

    return response.data.flightEmissions[0];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to get flight emissions data';
      console.error('API Error:', error.response?.data);
      throw new Error(errorMessage);
    }
    throw error;
  }
};

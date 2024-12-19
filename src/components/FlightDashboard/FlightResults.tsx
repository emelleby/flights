import React from 'react';
import { EmissionsResponse } from '../../services/api';
import { FlightEmissionResult } from '../../services/futureFlightsService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";

interface FormInputData {
  flightType: string;
  from: string;
  via: string;
  destination: string;
  flightClass: string;
  travelers: number;
  radiativeFactor: boolean;
  departureDate: string;
}

interface FutureFlightData {
  flightType: string;
  origin: string;
  destination: string;
  operatingCarrierCode: string;
  flightNumber: string;
  departureDate: string;
  radiativeFactor: boolean;
  notes: string;
}

interface FlightResultsProps {
  activeTab: 'past' | 'future';
  pastFormData: FormInputData;
  futureFormData: FutureFlightData;
  emissionsData: EmissionsResponse | null;
  futureEmissionsData: FlightEmissionResult | null;
  loading: boolean;
  error: string | null;
}

const formatEmissions = (grams: number): string => {
  const kg = grams / 1000;
  return `${kg.toFixed(2)} kg CO₂e`;
};

export default function FlightResults({ 
  activeTab,
  pastFormData,
  futureFormData,
  emissionsData,
  futureEmissionsData,
  loading,
  error
}: FlightResultsProps) {
  if (loading) {
    return (
      <div className="mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'past' && emissionsData) {
    return (
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Flight Emissions Results</CardTitle>
            <CardDescription>
              {pastFormData.from} {pastFormData.via ? `→ ${pastFormData.via} →` : '→'} {pastFormData.destination}
              {pastFormData.flightType === 'Return' ? ' (Return)' : ' (One way)'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Total Emissions</p>
                <p className="text-2xl font-bold">{emissionsData.total_emissions.toFixed(2)} kg CO₂e</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Per Passenger</p>
                  <p>{emissionsData.per_passenger.toFixed(2)} kg CO₂e</p>
                </div>
                <div>
                  <p className="font-medium">Total Distance</p>
                  <p>{emissionsData.total_distance.toFixed(0)} km</p>
                </div>
                {pastFormData.radiativeFactor && (
                  <div>
                    <p className="font-medium">Without Radiative Forcing</p>
                    <p>{emissionsData.without_ir.toFixed(2)} kg CO₂e</p>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-4">
                <p>Flight details:</p>
                <ul className="list-disc list-inside">
                  <li>Class: {pastFormData.flightClass}</li>
                  <li>Departure: {new Date(pastFormData.departureDate).toLocaleDateString()}</li>
                  <li>Travelers: {pastFormData.travelers}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'future' && futureEmissionsData) {
    const { flight, emissionsGramsPerPax } = futureEmissionsData;
    return (
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Future Flight Emissions Estimate</CardTitle>
            <CardDescription>
              {flight.origin} → {flight.destination}
              {futureFormData.flightType === 'Return' ? ' (Return)' : ' (One way)'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">First Class</p>
                  <p>{formatEmissions(emissionsGramsPerPax.first)}</p>
                </div>
                <div>
                  <p className="font-medium">Business Class</p>
                  <p>{formatEmissions(emissionsGramsPerPax.business)}</p>
                </div>
                <div>
                  <p className="font-medium">Premium Economy</p>
                  <p>{formatEmissions(emissionsGramsPerPax.premiumEconomy)}</p>
                </div>
                <div>
                  <p className="font-medium">Economy</p>
                  <p>{formatEmissions(emissionsGramsPerPax.economy)}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-4">
                <p>Flight details:</p>
                <ul className="list-disc list-inside">
                  <li>Flight: {flight.operatingCarrierCode} {flight.flightNumber}</li>
                  <li>Departure: {`${flight.departureDate.year}-${String(flight.departureDate.month).padStart(2, '0')}-${String(flight.departureDate.day).padStart(2, '0')}`}</li>
                  {futureFormData.notes && (
                    <li>Notes: {futureFormData.notes}</li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

import React from 'react';
import { Plane, Route, Ruler, AlertCircle, Calendar, Users } from 'lucide-react';
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
  origin: string;
  destination: string;
  operatingCarrierCode: string;
  flightNumber: string;
  departureDate: string;
  radiativeFactor: boolean;
  travelers: number;
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

interface DateComponents {
  year: number;
  month: number;
  day: number;
}

const formatEmissions = (grams: number): string => {
  const kg = grams / 1000;
  return `${kg.toFixed(2)} kg CO₂e`;
};

const formatDate = (dateInput: string | DateComponents): string => {
  try {
    if (typeof dateInput === 'string') {
      const date = new Date(dateInput);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      const { year, month, day } = dateInput;
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
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
            <div className="flex items-center justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
            <div className="flex items-center text-red-500 p-4">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {activeTab === 'past' && emissionsData && (
        <>
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Plane className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Emissions</p>
                      <p className="text-2xl font-bold text-blue-700">{emissionsData.total_emissions.toFixed(2)} kg CO₂e</p>
                      {pastFormData.radiativeFactor && (
                        <div className="flex items-center text-amber-600 mt-1">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs">Including radiative forcing</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 rounded-full p-2">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Per Passenger</p>
                      <p className="text-2xl font-bold text-green-700">{emissionsData.per_passenger.toFixed(2)} kg CO₂e</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Ruler className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Distance</p>
                      <p className="text-2xl font-bold text-purple-700">{emissionsData.total_distance} km</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {emissionsData.route_details.map((route, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="bg-blue-100 rounded-full p-2">
                        <Plane className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {route.operatingCarrierCode === "" || route.flightNumber === 0
                          ? "No specific flight found for this leg"
                          : `${route.operatingCarrierCode} ${route.flightNumber}`}
                      </span>
                    </div>
                    {!route.found && (
                      <div className="flex items-center text-amber-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">Estimated</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-lg font-bold">{route.origin}</div>
                    </div>
                    <div className="flex-1 px-4">
                      <div className="h-0.5 bg-gray-300 relative">
                        <div className="absolute w-2 h-2 bg-gray-300 rounded-full -mt-0.5 -ml-1"></div>
                        <div className="absolute w-2 h-2 bg-gray-300 rounded-full -mt-0.5 -mr-1 right-0"></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{route.destination}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{formatDate(pastFormData.departureDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{pastFormData.travelers} traveler(s)</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Emissions by class (kg CO₂e):</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm">
                        <span className="text-gray-600">Economy:</span>{' '}
                        <span className="font-medium">{(route.emissions.economy).toFixed(2)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Premium Economy:</span>{' '}
                        <span className="font-medium">{(route.emissions.premium_economy).toFixed(2)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Business:</span>{' '}
                        <span className="font-medium">{(route.emissions.business).toFixed(2)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">First:</span>{' '}
                        <span className="font-medium">{(route.emissions.first).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {activeTab === 'future' && futureEmissionsData && (
        <>
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Plane className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Emissions</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {formatEmissions(futureEmissionsData.emissionsGramsPerPax.economy * (futureFormData.radiativeFactor ? 2 : 1) * futureFormData.travelers)}
                      </p>
                      {futureFormData.radiativeFactor && (
                        <>
                          <p className="text-sm text-gray-500">
                            Without IR: {formatEmissions(futureEmissionsData.emissionsGramsPerPax.economy * futureFormData.travelers)}
                          </p>
                          <div className="flex items-center text-amber-600 mt-1">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            <span className="text-xs">Including radiative forcing</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 rounded-full p-2">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Per Passenger</p>
                      <p className="text-2xl font-bold text-green-700">
                        {formatEmissions(futureEmissionsData.emissionsGramsPerPax.economy * (futureFormData.radiativeFactor ? 2 : 1))}
                      </p>
                      {futureFormData.radiativeFactor && (
                        <p className="text-sm text-gray-500">
                          Without IR: {formatEmissions(futureEmissionsData.emissionsGramsPerPax.economy)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Ruler className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Distance</p>
                      <p className="text-2xl font-bold text-purple-700">TBD km</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Plane className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {futureEmissionsData.flight.operatingCarrierCode} {futureEmissionsData.flight.flightNumber}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-lg font-bold">{futureEmissionsData.flight.origin}</div>
                  </div>
                  <div className="flex-1 px-4">
                    <div className="h-0.5 bg-gray-300 relative">
                      <div className="absolute w-2 h-2 bg-gray-300 rounded-full -mt-0.5 -ml-1"></div>
                      <div className="absolute w-2 h-2 bg-gray-300 rounded-full -mt-0.5 -mr-1 right-0"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{futureEmissionsData.flight.destination}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {formatDate(futureEmissionsData.flight.departureDate)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{futureFormData.travelers} traveler(s)</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Emissions by class (kg CO₂e):</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm">
                      <span className="text-gray-600">Economy:</span>{' '}
                      <span className="font-medium">
                        {formatEmissions(futureEmissionsData.emissionsGramsPerPax.economy * (futureFormData.radiativeFactor ? 2 : 1) * futureFormData.travelers)}
                      </span>
                      {futureFormData.radiativeFactor && (
                        <div className="text-xs text-gray-500">
                          Without IR: {formatEmissions(futureEmissionsData.emissionsGramsPerPax.economy * futureFormData.travelers)}
                        </div>
                      )}
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Premium Economy:</span>{' '}
                      <span className="font-medium">
                        {formatEmissions(futureEmissionsData.emissionsGramsPerPax.premiumEconomy * (futureFormData.radiativeFactor ? 2 : 1) * futureFormData.travelers)}
                      </span>
                      {futureFormData.radiativeFactor && (
                        <div className="text-xs text-gray-500">
                          Without IR: {formatEmissions(futureEmissionsData.emissionsGramsPerPax.premiumEconomy * futureFormData.travelers)}
                        </div>
                      )}
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Business:</span>{' '}
                      <span className="font-medium">
                        {formatEmissions(futureEmissionsData.emissionsGramsPerPax.business * (futureFormData.radiativeFactor ? 2 : 1) * futureFormData.travelers)}
                      </span>
                      {futureFormData.radiativeFactor && (
                        <div className="text-xs text-gray-500">
                          Without IR: {formatEmissions(futureEmissionsData.emissionsGramsPerPax.business * futureFormData.travelers)}
                        </div>
                      )}
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">First:</span>{' '}
                      <span className="font-medium">
                        {formatEmissions(futureEmissionsData.emissionsGramsPerPax.first * (futureFormData.radiativeFactor ? 2 : 1) * futureFormData.travelers)}
                      </span>
                      {futureFormData.radiativeFactor && (
                        <div className="text-xs text-gray-500">
                          Without IR: {formatEmissions(futureEmissionsData.emissionsGramsPerPax.first * futureFormData.travelers)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

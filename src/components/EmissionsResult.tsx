import React from 'react';
import { Plane, Route, Ruler, AlertCircle, Calendar, Users } from 'lucide-react';
import type { EmissionsResponse, RouteDetail } from '../services/api';
import { type FormInputData } from './FlightSearchForm';

interface EmissionsResultProps {
  data: EmissionsResponse;
  loading: boolean;
  formData: FormInputData;
}

function FlightCard({ flight, formData }: { flight: RouteDetail; formData: FormInputData  }) {
  console.log("Request Data in FlightCard:", formData);
  let type: number;
  if (formData.flightType === "Return") {
    type = 2;
  } else {
    type = 1; // Default or alternative
  }
  let ir: number;
  if (formData.radiativeFactor) {
    ir = 2;
  } else {
    ir = 1; // Default or alternative
  }

  const formatDate = (date: { year: number; month: number; day: number }) => {
    return new Date(date.year, date.month - 1, date.day).toLocaleDateString('no-NO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 rounded-full p-2">
            <Plane className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-medium text-gray-900">
            {flight.operatingCarrierCode === "" || flight.flightNumber === 0
              ? "No specific flight found for this leg"
              : `${flight.operatingCarrierCode} ${flight.flightNumber}`}
          </span>

        </div>
        {!flight.found && (
          <div className="flex items-center text-amber-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span className="text-sm">Estimated</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-center">
          <div className="text-lg font-bold">{flight.origin}</div>
        </div>
        <div className="flex-1 px-4">
          <div className="h-0.5 bg-gray-300 relative">
            <div className="absolute w-2 h-2 bg-gray-300 rounded-full -mt-0.5 -ml-1"></div>
            <div className="absolute w-2 h-2 bg-gray-300 rounded-full -mt-0.5 -mr-1 right-0"></div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">{flight.destination}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{formatDate(flight.departureDate)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{formData.travelers} traveler(s)</span>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Emissions by class (kg CO₂e):</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm">
            <span className="text-gray-600">Economy:</span>{' '}
            <span className="font-medium">{(formData.travelers * ir * type * flight.emissions.economy).toFixed(2)}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Premium Economy:</span>{' '}
            <span className="font-medium">{(formData.travelers * ir * type * flight.emissions.premium_economy).toFixed(2)}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Business:</span>{' '}
            <span className="font-medium">{(formData.travelers * ir * type * flight.emissions.business).toFixed(2)}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">First:</span>{' '}
            <span className="font-medium">{(formData.travelers * ir * type * flight.emissions.first).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmissionsResult({ data, loading, formData }: EmissionsResultProps) {
  if (loading) {
    return (
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-sky-50 ring-1 ring-sky-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              <Plane className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Emissions</p>
              <p className="text-xl font-bold text-gray-900">{data.total_emissions.toFixed(2)} kg CO₂e</p>
              <p className="text-xs text-gray-500">Without IR: {data.without_ir.toFixed(2)} kg CO₂e</p>
            </div>
          </div>
        </div>

        <div className="bg-teal-50 ring-1 ring-teal-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-full p-2">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Per Passenger</p>
              <p className="text-xl font-bold text-gray-900">{data.per_passenger.toFixed(2)} kg CO₂e</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 ring-1 ring-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 rounded-full p-2">
              <Ruler className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Distance</p>
              <p className="text-xl font-bold text-gray-900">{data.total_distance.toFixed(0)} km</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Flight Details</h3>
        <div className="grid grid-cols-1 gap-4">
          {data.route_details.map((flight, index) => (
            <FlightCard key={index} flight={flight} formData={formData} />
          ))}
        </div>
      </div>
    </div>
  );
}
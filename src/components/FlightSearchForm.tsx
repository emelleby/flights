import React, { useState } from 'react';
import { Plane, Users, AlertCircle, Calendar } from 'lucide-react';
import SelectInput from './SelectInput';
import EmissionsResult from './EmissionsResult';
import { calculateEmissions, type EmissionsRequest, type EmissionsResponse } from '../services/api';

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

const FLIGHT_TYPES = ['Return', 'One way'];
const FLIGHT_CLASSES = ['Economy', 'Premium Economy', 'Business', 'First'];
const AIRPORTS = ['OSL', 'CPH', 'MIA', 'FRA', 'SFO', 'LHR', 'CDG', 'JFK'];

const INITIAL_FORM_DATA: FormInputData = {
  flightType: 'Return',
  from: '',
  via: '',
  destination: '',
  flightClass: 'Economy',
  travelers: 1,
  radiativeFactor: false,
  departureDate: '',
};

const transformFormData = (data: FormInputData): EmissionsRequest => {
  return {
    route: [data.from, data.via, data.destination].filter(Boolean),
    class: data.flightClass.toLowerCase().replace(' ', '_'),
    return: data.flightType === 'Return',
    ir_factor: data.radiativeFactor,
    departureDate: data.departureDate,
    travelers: data.travelers
  };
};

export default function FlightSearchForm() {
  const [formData, setFormData] = useState<FormInputData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emissionsData, setEmissionsData] = useState<EmissionsResponse | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const transformedData = transformFormData(formData);
      const result = await calculateEmissions(transformedData);
      setEmissionsData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setEmissionsData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Flight Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flight Type
              </label>
              <SelectInput
                value={formData.flightType}
                onChange={(value) => setFormData({ ...formData, flightType: value })}
                options={FLIGHT_TYPES}
                placeholder="Select Type"
              />
            </div>

            {/* From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <SelectInput
                value={formData.from}
                onChange={(value) => setFormData({ ...formData, from: value })}
                options={AIRPORTS}
                placeholder="Search Airport"
              />
            </div>

            {/* Via */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Via
              </label>
              <SelectInput
                value={formData.via}
                onChange={(value) => setFormData({ ...formData, via: value })}
                options={AIRPORTS}
                placeholder="Search Airport"
              />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <SelectInput
                value={formData.destination}
                onChange={(value) => setFormData({ ...formData, destination: value })}
                options={AIRPORTS}
                placeholder="Search Airport"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Flight Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flight Class
              </label>
              <SelectInput
                value={formData.flightClass}
                onChange={(value) => setFormData({ ...formData, flightClass: value })}
                options={FLIGHT_CLASSES}
                placeholder="Select Class"
              />
            </div>

            {/* Departure Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.departureDate}
                  onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Traveler */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Traveller
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 relative">
            <input
              type="checkbox"
              checked={formData.radiativeFactor}
              onChange={(e) => setFormData({ ...formData, radiativeFactor: e.target.checked })}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Add Radiative Factor</span>
            <div 
              className="relative inline-block"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <AlertCircle className="w-4 h-4 text-gray-400 cursor-help" />
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                  <div className="relative">
                    Radiative forcing accounts for the additional warming effects of emissions at high altitudes.
                    This calculator uses a factor of 2, although scientific estimates range from 1.7 to 3.
                    <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2.5 bg-blue-500 text-white font-medium text-sm rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <Plane className="w-5 h-5 mr-2" />
                  Calculate Emissions
                </>
              )}
            </button>
          </div>
        </form>

        {emissionsData && <EmissionsResult data={emissionsData} loading={loading} />}
      </div>
    </>
  );
}
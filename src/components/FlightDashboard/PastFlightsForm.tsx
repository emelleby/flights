import React, { useState } from 'react';
import { Plane, Users, Calendar } from 'lucide-react';
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { EmissionsResponse, EmissionsRequest } from '../../services/api';
import { calculateEmissions } from '../../services/api';

const AIRPORTS = ['OSL', 'CPH', 'MIA', 'FRA', 'SFO', 'LHR', 'CDG', 'JFK', 'ZRH', 'BOS'];
const FLIGHT_TYPES = ['Return', 'One way'];
const FLIGHT_CLASSES = ['Economy', 'Premium Economy', 'Business', 'First'];

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

interface PastFlightsFormProps {
  formData: FormInputData;
  setFormData: (data: FormInputData) => void;
  setEmissionsData: (data: EmissionsResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  showTooltip: boolean;
  setShowTooltip: (show: boolean) => void;
}

export default function PastFlightsForm({ 
  formData,
  setFormData,
  setEmissionsData, 
  setLoading,
  setError,
  showTooltip,
  setShowTooltip
}: PastFlightsFormProps) {
  const [inputValue, setInputValue] = useState<string>(formData.travelers.toString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmissionsData(null);
    setError(null);
    
    try {
      if (!formData.from || !formData.destination) {
        throw new Error('Origin and destination airports are required');
      }

      const route = [formData.from];
      if (formData.via) {
        route.push(formData.via);
      }
      route.push(formData.destination);

      const requestData: EmissionsRequest = {
        class: formData.flightClass.toLowerCase().replace(' ', '_'),
        departureDate: formData.departureDate,
        ir_factor: formData.radiativeFactor,
        return: formData.flightType === 'Return',
        route: route,
        travelers: formData.travelers
      };

      const result = await calculateEmissions(requestData);
      setEmissionsData(result);
    } catch (error) {
      console.error('Error calculating emissions:', error);
      setError(error instanceof Error ? error.message : 'Failed to calculate emissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Flight Type</Label>
          <Select
            value={formData.flightType}
            onValueChange={(value) => setFormData({ ...formData, flightType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select flight type" />
            </SelectTrigger>
            <SelectContent>
              {FLIGHT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Cabin Class</Label>
          <Select
            value={formData.flightClass}
            onValueChange={(value) => setFormData({ ...formData, flightClass: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select cabin class" />
            </SelectTrigger>
            <SelectContent>
              {FLIGHT_CLASSES.map((cabinClass) => (
                <SelectItem key={cabinClass} value={cabinClass}>
                  {cabinClass}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>From</Label>
          <Select
            value={formData.from}
            onValueChange={(value) => setFormData({ ...formData, from: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select origin">
                <div className="flex items-center">
                  <Plane className="mr-2 h-4 w-4" />
                  <span>{formData.from || 'Select origin'}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {AIRPORTS.map((airport) => (
                <SelectItem key={airport} value={airport}>
                  {airport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Via (Optional)</Label>
          <Select
            value={formData.via}
            onValueChange={(value) => setFormData({ ...formData, via: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select via">
                <div className="flex items-center">
                  <Plane className="mr-2 h-4 w-4" />
                  <span>{formData.via || 'Select via'}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {AIRPORTS.map((airport) => (
                <SelectItem key={airport} value={airport}>
                  {airport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>To</Label>
          <Select
            value={formData.destination}
            onValueChange={(value) => setFormData({ ...formData, destination: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select destination">
                <div className="flex items-center">
                  <Plane className="mr-2 h-4 w-4" />
                  <span>{formData.destination || 'Select destination'}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {AIRPORTS.map((airport) => (
                <SelectItem key={airport} value={airport}>
                  {airport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departureDate">Departure Date</Label>
          <div className="relative">
            <Input
              id="departureDate"
              type="date"
              value={formData.departureDate}
              onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
              required
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Number of Travelers</Label>
          <div className="relative">
            <Input
              type="number"
              min="1"
              value={inputValue}
              onBlur={(e) => {
                const value = Math.max(1, parseInt(e.target.value) || 1);
                setFormData({ ...formData, travelers: value });
                setInputValue(value.toString());
              }}
              onChange={(e) => {
                setInputValue(e.target.value);
                const parsed = parseInt(e.target.value);
                if (!isNaN(parsed)) {
                  setFormData({ ...formData, travelers: parsed });
                }
              }}
              required
            />
            <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="radiativeFactor"
          checked={formData.radiativeFactor}
          onCheckedChange={(checked) => setFormData({ ...formData, radiativeFactor: checked as boolean })}
        />
        <Label htmlFor="radiativeFactor">Include radiative forcing in calculation</Label>
      </div>

      <Button type="submit" className="w-full">
        Calculate Emissions
      </Button>
    </form>
  );
}

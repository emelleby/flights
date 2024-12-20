import React, { useState } from 'react';
import { Plane, Calendar } from 'lucide-react';
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { submitFutureFlight } from '../../services/futureFlightsService';
import { FutureFlightData } from '../../services/types';

const AIRPORTS = ['OSL', 'CPH', 'MIA', 'FRA', 'SFO', 'LHR', 'CDG', 'JFK', 'ZRH', 'BOS'];
const AIRLINES = ['AF', 'LX', 'SK', 'LH', 'BA', 'DL', 'UA'];

interface FutureFlightsFormProps {
  formData: FutureFlightData;
  setFormData: (data: FutureFlightData) => void;
  setError: (error: string | null) => void;
  setFutureEmissionsData: (data: any) => void;
}

export default function FutureFlightsForm({ 
  formData,
  setFormData,
  setError,
  setFutureEmissionsData
}: FutureFlightsFormProps) {
  const [inputValue, setInputValue] = useState<string>(formData.travelers.toString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.origin || !formData.destination) {
        throw new Error('Origin and destination airports are required');
      }
      if (!formData.operatingCarrierCode) {
        throw new Error('Airline code is required');
      }
      if (!formData.flightNumber) {
        throw new Error('Flight number is required');
      }
      if (!formData.departureDate) {
        throw new Error('Departure date is required');
      }

      // Validate future date
      const selectedDate = new Date(formData.departureDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        throw new Error('Departure date must be in the future');
      }

      const result = await submitFutureFlight({
        origin: formData.origin,
        destination: formData.destination,
        operatingCarrierCode: formData.operatingCarrierCode,
        flightNumber: formData.flightNumber,
        departureDate: formData.departureDate
      });

      console.log('Future flight emissions:', result);
      setFutureEmissionsData(result);
    } catch (error) {
      console.error('Error submitting future flight:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit future flight');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="origin">From</Label>
          <Select
            value={formData.origin}
            onValueChange={(value) => setFormData({ ...formData, origin: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select origin" />
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
          <Label htmlFor="destination">To</Label>
          <Select
            value={formData.destination}
            onValueChange={(value) => setFormData({ ...formData, destination: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select destination" />
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
          <Label htmlFor="departureDate">Departure Date</Label>
          <div className="relative">
            <Input
              id="departureDate"
              type="date"
              value={formData.departureDate}
              onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
              required
              min={new Date().toISOString().split('T')[0]}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="airline">Airline</Label>
          <Select
            value={formData.operatingCarrierCode}
            onValueChange={(value) => setFormData({ ...formData, operatingCarrierCode: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select airline" />
            </SelectTrigger>
            <SelectContent>
              {AIRLINES.map((airline) => (
                <SelectItem key={airline} value={airline}>
                  {airline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="flightNumber">Flight Number</Label>
          <Input
            id="flightNumber"
            type="text"
            value={formData.flightNumber}
            onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
            required
            pattern="[0-9]*"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="travelers">Number of Travelers</Label>
          <Input
            id="travelers"
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
            placeholder="Enter number of travelers"
            required
          />
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
        Calculate Future Flight Emissions
      </Button>
    </form>
  );
}

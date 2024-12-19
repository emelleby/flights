import React, { useState } from 'react';
import { Plane, Calendar } from 'lucide-react';
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { submitFutureFlight } from '../../services/futureFlightsService';

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

const AIRPORTS = ['OSL', 'CPH', 'MIA', 'FRA', 'SFO', 'LHR', 'CDG', 'JFK', 'ZRH', 'BOS'];
const AIRLINES = ['AF', 'LX', 'SK', 'LH', 'BA', 'DL', 'UA'];
const FLIGHT_TYPES = ['Return', 'One way'];

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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>From</Label>
          <Select
            value={formData.origin}
            onValueChange={(value) => setFormData({ ...formData, origin: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select origin">
                <div className="flex items-center">
                  <Plane className="mr-2 h-4 w-4" />
                  <span>{formData.origin || 'Select origin'}</span>
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
            required
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
          <Label>Airline</Label>
          <Select
            value={formData.operatingCarrierCode}
            onValueChange={(value) => setFormData({ ...formData, operatingCarrierCode: value })}
            required
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
          <Label>Flight Number</Label>
          <Input
            type="text"
            value={formData.flightNumber}
            onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
            placeholder="Enter flight number"
            required
          />
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
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any notes about this future flight..."
          className="h-24"
        />
      </div>

      <Button type="submit" className="w-full">
        Calculate Future Flight Emissions
      </Button>
    </form>
  );
}

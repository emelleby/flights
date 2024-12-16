import React, { useState } from 'react';
import { Plane, Calendar } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FutureFlightData {
  flightType: string;
  origin: string;
  destination: string;
  operatingCarrierCode: string;
  flightNumber: string;
  departureDate: string;
  radiativeFactor: boolean;
}

const AIRPORTS = ['OSL', 'CPH', 'MIA', 'FRA', 'SFO', 'LHR', 'CDG', 'JFK', 'ZRH', 'BOS'];
const AIRLINES = ['AF', 'LX', 'SK', 'LH', 'BA', 'DL', 'UA'];
const FLIGHT_TYPES = ['Return', 'One way'];

const INITIAL_FORM_DATA: FutureFlightData = {
  flightType: 'Return',
  origin: '',
  destination: '',
  operatingCarrierCode: '',
  flightNumber: '',
  departureDate: '',
  radiativeFactor: false,
};

export default function FutureFlightForm() {
  const [formData, setFormData] = useState<FutureFlightData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emissionsData, setEmissionsData] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const [year, month, day] = formData.departureDate.split('-').map(Number);
      
      const requestData = {
        flights: [{
          origin: formData.origin,
          destination: formData.destination,
          operatingCarrierCode: formData.operatingCarrierCode,
          flightNumber: parseInt(formData.flightNumber),
          departureDate: { year, month, day }
        }]
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_GOOGLE_TRAVEL_API_URL}/flights:computeFlightEmissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GOOGLE_TRAVEL_API_KEY}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch emissions data');
      }

      const data = await response.json();
      setEmissionsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="flightType">Flight Type</Label>
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

      <div className="flex items-center space-x-2">
        <Checkbox
          id="radiativeFactor"
          checked={formData.radiativeFactor}
          onCheckedChange={(checked) => 
            setFormData({ ...formData, radiativeFactor: checked as boolean })
          }
        />
        <Label
          htmlFor="radiativeFactor"
          className="text-sm text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Include radiative forcing in calculation
        </Label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? 'Calculating...' : 'Calculate Emissions'}
      </button>

      {error && (
        <div className="text-destructive mt-2">
          {error}
        </div>
      )}

      {emissionsData && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(emissionsData, null, 2)}
          </pre>
        </div>
      )}
    </form>
  );
}

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
  origin: string;
  destination: string;
  operatingCarrierCode: string;
  flightNumber: string;
  departureDate: string;
  radiativeFactor: boolean;
  travelers: number;
}

const AIRPORTS = ['OSL', 'CPH', 'MIA', 'FRA', 'SFO', 'LHR', 'CDG', 'JFK', 'ZRH', 'BOS'];
const AIRLINES = ['AF', 'LX', 'SK', 'LH', 'BA', 'DL', 'UA'];

const INITIAL_FORM_DATA: FutureFlightData = {
  origin: '',
  destination: '',
  operatingCarrierCode: '',
  flightNumber: '',
  departureDate: '',
  radiativeFactor: false,
  travelers: 1,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="origin">Origin</Label>
          <Select
            name="origin"
            value={formData.origin}
            onValueChange={(value) => handleInputChange({ target: { name: 'origin', value } })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select origin airport" />
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

        <div className="grid gap-2">
          <Label htmlFor="destination">Destination</Label>
          <Select
            name="destination"
            value={formData.destination}
            onValueChange={(value) => handleInputChange({ target: { name: 'destination', value } })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select destination airport" />
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

        <div className="grid gap-2">
          <Label htmlFor="operatingCarrierCode">Airline</Label>
          <Select
            name="operatingCarrierCode"
            value={formData.operatingCarrierCode}
            onValueChange={(value) => handleInputChange({ target: { name: 'operatingCarrierCode', value } })}
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

        <div className="grid gap-2">
          <Label htmlFor="flightNumber">Flight Number</Label>
          <Input
            id="flightNumber"
            name="flightNumber"
            type="text"
            value={formData.flightNumber}
            onChange={handleInputChange}
            placeholder="Enter flight number"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="departureDate">Departure Date</Label>
          <Input
            id="departureDate"
            name="departureDate"
            type="date"
            value={formData.departureDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="travelers">Number of Travelers</Label>
          <Input
            id="travelers"
            name="travelers"
            type="number"
            min="1"
            value={formData.travelers}
            onChange={handleInputChange}
            placeholder="Enter number of travelers"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="radiativeFactor"
            name="radiativeFactor"
            checked={formData.radiativeFactor}
            onCheckedChange={(checked) => handleInputChange({ target: { name: 'radiativeFactor', value: checked } })}
          />
          <Label htmlFor="radiativeFactor">Include radiative forcing factor</Label>
        </div>
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

import React, { useState } from 'react';
import { Plane, Users, AlertCircle, Calendar } from 'lucide-react';
import EmissionsResult from './EmissionsResult';
import FutureFlightForm from './FutureFlightForm';
import { calculateEmissions, type EmissionsRequest, type EmissionsResponse } from '../services/api';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FormInputData {
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
  const [activeTab, setActiveTab] = useState<'past' | 'future'>('past');
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
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="past" value={activeTab} onValueChange={(value) => setActiveTab(value as 'past' | 'future')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="past">Past Flights</TabsTrigger>
          <TabsTrigger value="future">Future Flights</TabsTrigger>
        </TabsList>
        <TabsContent value="past">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Flight Type */}
              <div className="md:col-span-4 space-y-2">
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

              {/* From */}
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Select
                  value={formData.from}
                  onValueChange={(value) => setFormData({ ...formData, from: value })}
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

              {/* Via */}
              <div className="space-y-2">
                <Label htmlFor="via">Via (Optional)</Label>
                <Select
                  value={formData.via}
                  onValueChange={(value) => setFormData({ ...formData, via: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stopover" />
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

              {/* To */}
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

              {/* Flight Class */}
              <div className="space-y-2">
                <Label htmlFor="flightClass">Class</Label>
                <Select
                  value={formData.flightClass}
                  onValueChange={(value) => setFormData({ ...formData, flightClass: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {FLIGHT_CLASSES.map((flightClass) => (
                      <SelectItem key={flightClass} value={flightClass}>
                        {flightClass}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Number of Travelers */}
              <div className="space-y-2">
                <Label htmlFor="travelers">Number of Travelers</Label>
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })}
                  className="w-full"
                />
              </div>

              {/* Departure Date */}
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

              {/* Radiative Factor */}
              <div className="md:col-span-4 flex items-center space-x-2">
                <Checkbox
                  id="radiativeFactor"
                  checked={formData.radiativeFactor}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, radiativeFactor: checked as boolean })
                  }
                />
                <div className="flex items-center space-x-2">
                  <Label
                    htmlFor="radiativeFactor"
                    className="text-sm text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include radiative forcing in calculation
                  </Label>
                  <AlertCircle
                    className="h-4 w-4 text-muted-foreground cursor-help"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  />
                  {showTooltip && (
                    <div className="absolute z-50 px-2 py-1 text-xs bg-popover text-popover-foreground rounded shadow-lg border border-border">
                      Radiative forcing accounts for the additional warming effect of emissions at high altitude
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? 'Calculating...' : 'Calculate Emissions'}
            </button>
          </form>
        </TabsContent>
        <TabsContent value="future">
          <FutureFlightForm />
        </TabsContent>
      </Tabs>

      {emissionsData && <EmissionsResult data={emissionsData} loading={loading} formData={formData}/>}
    </div>
  );
}
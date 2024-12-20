import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import PastFlightsForm from './PastFlightsForm';
import FutureFlightsForm from './FutureFlightsForm';
import FlightResults from './FlightResults';
import { EmissionsResponse } from '../../services/api';
import { FlightEmissionResult } from '../../services/futureFlightsService';

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

const INITIAL_PAST_FORM_DATA: FormInputData = {
  flightType: 'One way',
  from: '',
  via: '',
  destination: '',
  flightClass: 'Economy',
  travelers: 1,
  radiativeFactor: true,
  departureDate: ''
};

const INITIAL_FUTURE_FORM_DATA: FutureFlightData = {
  origin: '',
  destination: '',
  operatingCarrierCode: '',
  flightNumber: '',
  departureDate: '',
  radiativeFactor: true,
  travelers: 1
};

export default function FlightDashboard() {
  const [activeTab, setActiveTab] = useState<'past' | 'future'>('past');
  const [pastFormData, setPastFormData] = useState<FormInputData>(INITIAL_PAST_FORM_DATA);
  const [futureFormData, setFutureFormData] = useState<FutureFlightData>(INITIAL_FUTURE_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emissionsData, setEmissionsData] = useState<EmissionsResponse | null>(null);
  const [futureEmissionsData, setFutureEmissionsData] = useState<FlightEmissionResult | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="past" value={activeTab} onValueChange={(value) => setActiveTab(value as 'past' | 'future')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="past">Past Flights</TabsTrigger>
          <TabsTrigger value="future">Future Flights</TabsTrigger>
        </TabsList>

        <TabsContent value="past">
          <PastFlightsForm
            formData={pastFormData}
            setFormData={setPastFormData}
            setEmissionsData={setEmissionsData}
            setLoading={setLoading}
            setError={setError}
            showTooltip={showTooltip}
            setShowTooltip={setShowTooltip}
          />
        </TabsContent>

        <TabsContent value="future">
          <FutureFlightsForm
            formData={futureFormData}
            setFormData={setFutureFormData}
            setError={setError}
            setFutureEmissionsData={setFutureEmissionsData}
          />
        </TabsContent>
      </Tabs>

      <FlightResults
        activeTab={activeTab}
        pastFormData={pastFormData}
        futureFormData={futureFormData}
        emissionsData={emissionsData}
        futureEmissionsData={futureEmissionsData}
        loading={loading}
        error={error}
      />
    </div>
  );
}

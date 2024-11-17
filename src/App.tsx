import React from 'react';
import FlightSearchForm from './components/FlightSearchForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Flight emissions lookup powered by Scope321</h1>
          <p className="mt-2 text-gray-600">Find the emissions related to your flights.</p>
        </div>
        <FlightSearchForm />
      </div>
    </div>
  );
}

export default App;
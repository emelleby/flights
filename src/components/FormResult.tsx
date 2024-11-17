import React from 'react';

interface FormResultProps {
  data: Record<string, any>;
}

export default function FormResult({ data }: FormResultProps) {
  return (
    <div className="mt-8 bg-gray-900 rounded-lg p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">Form Data</h2>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"/>
          <div className="w-3 h-3 rounded-full bg-yellow-500"/>
          <div className="w-3 h-3 rounded-full bg-green-500"/>
        </div>
      </div>
      <pre className="text-green-400 font-mono text-sm overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
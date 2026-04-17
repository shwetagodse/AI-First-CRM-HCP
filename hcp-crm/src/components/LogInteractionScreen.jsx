import React from 'react';
import InteractionForm from './InteractionForm';
import AIAssistant from './AIAssistant';

const LogInteractionScreen = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Inter']">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Log HCP Interaction</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Structured Form (70% width) */}
        <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Interaction Details</h2>
          <InteractionForm />
        </div>

        {/* Right Column: AI Assistant (30% width) */}
        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[800px]">
          <AIAssistant />
        </div>
      </div>
    </div>
  );
};

export default LogInteractionScreen;
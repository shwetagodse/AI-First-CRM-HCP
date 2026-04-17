import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFormField, addChatMessage, setProcessing } from '../store/interactionSlice';
import { Mic, Search, Plus } from 'lucide-react';

const InteractionForm = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.interaction.formData);

  const handleChange = (e) => {
    dispatch(updateFormField({ field: e.target.name, value: e.target.value }));
  };

  const handleActionClick = async (actionText) => {
    dispatch(
      addChatMessage({
        role: "user",
        content: `Please execute this action: ${actionText}`,
      }),
    );
    dispatch(setProcessing(true));

    // Simulate the AI acknowledging the action for the demo
    setTimeout(() => {
      dispatch(
        addChatMessage({
          role: "ai",
          content: `Done! I have added this to your pending CRM tasks: "${actionText}".`,
        }),
      );
      dispatch(setProcessing(false));
    }, 1000);
  };

  return (
    <form className="space-y-6 text-sm text-gray-700">
      {/* Top Row: HCP & Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">HCP Name</label>
          <input type="text" name="hcpName" value={formData.hcpName} onChange={handleChange} placeholder="Search or select HCP..." className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-100 outline-none" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Interaction Type</label>
          <select name="interactionType" value={formData.interactionType} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-100 outline-none">
            <option>Meeting</option>
            <option>Email</option>
            <option>Call</option>
          </select>
        </div>
      </div>

      {/* Topics Discussed */}
      <div>
        <label className="block mb-1 font-medium">Topics Discussed</label>
        <div className="relative">
          <textarea name="topicsDiscussed" value={formData.topicsDiscussed} onChange={handleChange} placeholder="Enter key discussion points..." rows="3" className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-100"></textarea>
          <Mic className="absolute bottom-3 right-3 text-gray-400 w-4 h-4 cursor-pointer hover:text-blue-500" />
        </div>
        <button type="button" className="mt-2 text-xs text-blue-500 flex items-center gap-1 hover:text-blue-700 transition">
          🎙️ Summarize from Voice Note (Requires Consent)
        </button>
      </div>

      {/* Materials and Samples Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800 text-sm">Materials Shared / Samples Distributed</h3>
        
        {/* Materials Box */}
        <div className="border border-gray-200 rounded-md p-3">
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium text-gray-700">Materials Shared</label>
            <button type="button" className="text-xs border border-gray-300 flex items-center gap-1 px-3 py-1 rounded hover:bg-gray-50 transition">
              <Search className="w-3 h-3 text-blue-500" /> Search/Add
            </button>
          </div>
          <input 
            type="text" 
            name="materialsShared" 
            value={formData.materialsShared} 
            onChange={handleChange} 
            placeholder="No materials added." 
            className="w-full text-gray-500 outline-none bg-transparent" 
          />
        </div>

        {/* Samples Box */}
        <div className="border border-gray-200 rounded-md p-3">
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium text-gray-700">Samples Distributed</label>
            <button type="button" className="text-xs border border-gray-300 flex items-center gap-1 px-3 py-1 rounded hover:bg-gray-50 transition">
              <Plus className="w-3 h-3 text-blue-600" /> Add Sample
            </button>
          </div>
          <input 
            type="text" 
            name="samplesDistributed" 
            value={formData.samplesDistributed} 
            onChange={handleChange} 
            placeholder="No samples added." 
            className="w-full text-gray-500 outline-none bg-transparent" 
          />
        </div>
      </div>

      {/* Sentiment Radios with Emojis */}
      <div>
        <label className="block mb-2 font-medium">Observed/Inferred HCP Sentiment</label>
        <div className="flex gap-6">
          {[
            { label: 'Positive', emoji: '😀' },
            { label: 'Neutral', emoji: '😐' },
            { label: 'Negative', emoji: '😞' }
          ].map((sent) => (
            <label key={sent.label} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sentiment" value={sent.label} checked={formData.sentiment === sent.label} onChange={handleChange} className="text-purple-600 w-4 h-4 focus:ring-purple-500" />
              <span className="text-base">{sent.emoji}</span>
              <span className="text-gray-700">{sent.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* AI Suggested Follow-ups */}
      <div className="pt-4 border-t">
        <label className="block mb-2 font-medium text-gray-800">AI Suggested Follow-ups:</label>
        <ul className="text-blue-600 space-y-2 text-sm">
          <li onClick={() => handleActionClick("Schedule follow-up meeting in 2 weeks")} className="cursor-pointer hover:underline flex items-center gap-2">+ Schedule follow-up meeting in 2 weeks</li>
          <li onClick={() => handleActionClick("Send OncoBoost Phase III PDF")} className="cursor-pointer hover:underline flex items-center gap-2">+ Send OncoBoost Phase III PDF</li>
          <li onClick={() => handleActionClick("Add Dr. Sharma to advisory board invite list")} className="cursor-pointer hover:underline flex items-center gap-2">+ Add Dr. Sharma to advisory board invite list</li>
        </ul>
      </div>
    </form>
  );
};

export default InteractionForm;
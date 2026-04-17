import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    hcpName: "",
    interactionType: "Meeting",
    date: new Date().toISOString().split("T")[0],
    time: "",
    attendees: "",
    topicsDiscussed: "",
    materialsShared: "",
    samplesDistributed: "",
    sentiment: "Neutral",
    outcomes: "",
    followUpActions: "",
  },
  chatHistory: [
    {
      role: "system",
      content:
        'Log interaction details here (e.g., "Met Dr. Smith, discussed Product X efficacy, positive sentiment") or ask for help.',
    },
  ],
  isProcessingText: false,
};

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    // Allows the AI to batch-update the form after analyzing the chat
    bulkUpdateForm: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    addChatMessage: (state, action) => {
      state.chatHistory.push(action.payload);
    },
    setProcessing: (state, action) => {
      state.isProcessingText = action.payload;
    }
  }
});

export const { updateFormField, bulkUpdateForm, addChatMessage, setProcessing } = interactionSlice.actions;
export default interactionSlice.reducer;
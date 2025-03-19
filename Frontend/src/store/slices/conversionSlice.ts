import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConversionHistory {
  id: string;
  originalAudio: string;
  convertedAudio: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
}

interface ConversionState {
  history: ConversionHistory[];
  currentConversion: {
    status: 'idle' | 'recording' | 'processing' | 'completed' | 'failed';
    progress: number;
    error: string | null;
  };
}

const initialState: ConversionState = {
  history: [],
  currentConversion: {
    status: 'idle',
    progress: 0,
    error: null,
  },
};

const conversionSlice = createSlice({
  name: 'conversion',
  initialState,
  reducers: {
    setHistory: (state, action: PayloadAction<ConversionHistory[]>) => {
      state.history = action.payload;
    },
    addToHistory: (state, action: PayloadAction<ConversionHistory>) => {
      state.history.unshift(action.payload);
    },
    setConversionStatus: (
      state,
      action: PayloadAction<{
        status: 'idle' | 'recording' | 'processing' | 'completed' | 'failed';
        progress?: number;
        error?: string;
      }>
    ) => {
      state.currentConversion.status = action.payload.status;
      if (action.payload.progress !== undefined) {
        state.currentConversion.progress = action.payload.progress;
      }
      state.currentConversion.error = action.payload.error || null;
    },
  },
});

export const { setHistory, addToHistory, setConversionStatus } = conversionSlice.actions;
export default conversionSlice.reducer;
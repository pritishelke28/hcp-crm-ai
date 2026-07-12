import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch log history from the backend
export const fetchInteractions = createAsyncThunk('crm/fetchInteractions', async () => {
  const res = await fetch('http://localhost:8000/api/interactions');
  return res.json();
});

// Async thunk to submit a new structured form interaction
export const submitFormInteraction = createAsyncThunk('crm/submitForm', async (formData) => {
  const res = await fetch('http://localhost:8000/api/interactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return res.json();
});

const crmSlice = createSlice({
  name: 'crm',
  initialState: { logs: [], loading: false },
  reducers: {
    addLog: (state, action) => {
      state.logs.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.logs = action.payload;
      })
      .addCase(submitFormInteraction.fulfilled, (state, action) => {
        state.logs.unshift(action.payload);
      });
  },
});

export const { addLog } = crmSlice.actions;
export const store = configureStore({ reducer: { crm: crmSlice.reducer } });
export default store;
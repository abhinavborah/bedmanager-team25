import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchKpis = createAsyncThunk('analytics/fetchKpis', async () => {
  const res = await api.get('/analytics/occupancy-summary');
  return res.data;
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    kpis: {},
    occupancyByWard: [],
    trends: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKpis.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchKpis.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.kpis = action.payload;
      })
      .addCase(fetchKpis.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default analyticsSlice.reducer;

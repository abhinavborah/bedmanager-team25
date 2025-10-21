import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bedsAPI } from '../../services/api';

// Initial state
const initialState = {
  bedsList: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk to fetch all beds
export const fetchBeds = createAsyncThunk(
  'beds/fetchBeds',
  async (_, { rejectWithValue }) => {
    try {
      const beds = await bedsAPI.getAllBeds();
      return beds;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch beds';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to update bed status
export const updateBedStatus = createAsyncThunk(
  'beds/updateBedStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const updatedBed = await bedsAPI.updateBedStatus(id, status);
      return updatedBed;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update bed status';
      return rejectWithValue(message);
    }
  }
);

// Beds slice
const bedsSlice = createSlice({
  name: 'beds',
  initialState,
  reducers: {
    // Update a specific bed in the list (used by socket listener)
    updateBedInList: (state, action) => {
      const updatedBed = action.payload;
      const index = state.bedsList.findIndex(bed => bed._id === updatedBed._id);
      
      if (index !== -1) {
        // Update existing bed
        state.bedsList[index] = updatedBed;
      } else {
        // If bed not found, add it to the list
        state.bedsList.push(updatedBed);
      }
    },
    
    // Clear beds list (useful on logout)
    clearBeds: (state) => {
      state.bedsList = [];
      state.status = 'idle';
      state.error = null;
    },
    
    // Clear any errors
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch beds
      .addCase(fetchBeds.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBeds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bedsList = action.payload;
        state.error = null;
      })
      .addCase(fetchBeds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Update bed status
      .addCase(updateBedStatus.pending, (state) => {
        // Optionally set a loading state for individual bed updates
        state.error = null;
      })
      .addCase(updateBedStatus.fulfilled, (state, action) => {
        const updatedBed = action.payload;
        const index = state.bedsList.findIndex(bed => bed._id === updatedBed._id);
        
        if (index !== -1) {
          state.bedsList[index] = updatedBed;
        }
        state.error = null;
      })
      .addCase(updateBedStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Export actions
export const { updateBedInList, clearBeds, clearError } = bedsSlice.actions;

// Selectors
export const selectAllBeds = (state) => state.beds.bedsList;
export const selectBedsStatus = (state) => state.beds.status;
export const selectBedsError = (state) => state.beds.error;

// Selector to get bed by ID
export const selectBedById = (state, bedId) => 
  state.beds.bedsList.find(bed => bed._id === bedId);

// Selector to get beds by status
export const selectBedsByStatus = (state, status) =>
  state.beds.bedsList.filter(bed => bed.status === status);

// Selector to get bed statistics
export const selectBedStats = (state) => {
  const beds = state.beds.bedsList;
  return {
    total: beds.length,
    available: beds.filter(bed => bed.status === 'available').length,
    occupied: beds.filter(bed => bed.status === 'occupied').length,
    maintenance: beds.filter(bed => bed.status === 'maintenance').length,
  };
};

// Export reducer
export default bedsSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import goalService from './goalService';

const initialState = {
  goals: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getGoals = createAsyncThunk('goals/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    return await goalService.getGoals(token);
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch goals';
    return thunkAPI.rejectWithValue(message);
  }
});

export const addGoal = createAsyncThunk('goals/add', async (goalData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    return await goalService.addGoal(goalData, token);
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to add goal';
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateGoal = createAsyncThunk('goals/update', async ({ id, data }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    return await goalService.updateGoal(id, data, token);
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to update goal';
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteGoal = createAsyncThunk('goals/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    await goalService.deleteGoal(id, token);
    return id; // return id so we can filter it out in the reducer
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to delete goal';
    return thunkAPI.rejectWithValue(message);
  }
});

export const goalSlice = createSlice({
  name: 'goal',
  initialState,
  reducers: {
    resetGoals: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGoals.pending, (state) => { state.isLoading = true; })
      .addCase(getGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.goals = action.payload;
      })
      .addCase(getGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addGoal.pending, (state) => { state.isLoading = true; })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.goals.push(action.payload);
      })
      .addCase(addGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.goals.findIndex(g => g._id === action.payload._id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.goals = state.goals.filter(g => g._id !== action.payload);
      });
  },
});

export const { resetGoals } = goalSlice.actions;
export default goalSlice.reducer;

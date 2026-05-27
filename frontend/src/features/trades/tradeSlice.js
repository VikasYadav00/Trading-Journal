import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tradeService from './tradeService';

const initialState = {
  trades: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getTrades = createAsyncThunk('trades/getAll', async (_, thunkAPI) => {
  try {
    return await tradeService.getTrades();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const addTrade = createAsyncThunk('trades/add', async (tradeData, thunkAPI) => {
  try {
    return await tradeService.addTrade(tradeData);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateTrade = createAsyncThunk('trades/update', async ({ id, tradeData }, thunkAPI) => {
  try {
    return await tradeService.updateTrade(id, tradeData);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteTrade = createAsyncThunk('trades/delete', async (id, thunkAPI) => {
  try {
    await tradeService.deleteTrade(id);
    return id;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const syncTrades = createAsyncThunk('trades/sync', async (_, thunkAPI) => {
  try {
    return await tradeService.syncTrades();
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const tradeSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {
    resetTrades: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTrades.pending, (state) => { state.isLoading = true; })
      .addCase(getTrades.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.trades = action.payload;
      })
      .addCase(getTrades.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addTrade.pending, (state) => { state.isLoading = true; })
      .addCase(addTrade.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.trades.push(action.payload);
      })
      .addCase(addTrade.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTrade.pending, (state) => { state.isLoading = true; })
      .addCase(updateTrade.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.trades = state.trades.map(trade => 
          trade._id === action.payload._id ? action.payload : trade
        );
      })
      .addCase(updateTrade.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteTrade.fulfilled, (state, action) => {
        state.trades = state.trades.filter((t) => t._id !== action.payload);
      })
      .addCase(syncTrades.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(syncTrades.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.trades = action.payload;
      })
      .addCase(syncTrades.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetTrades } = tradeSlice.actions;
export default tradeSlice.reducer;

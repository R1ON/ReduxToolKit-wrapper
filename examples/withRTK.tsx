import { createSlice } from '@reduxjs/toolkit';
import { API, getAsyncThunk } from '../api';
  
export const getSomethingGood = getAsyncThunk(
    'KEY_FOR_REDUX_DEV_TOOLS',
    API.goodService.getSomethingGood,
);

// ---

export const initialState = {
  data: null,
};

export const mySlice = createSlice({
  name: 'slice-name',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSomethingGood.fulfilled, (_state, action) => {
        const data = action.payload.data; // TransformedData
      })
      .addCase(getSomethingGood.rejected, (_state, action) => {
        const error = action.payload; // TransformedError
      })
  },
});


  
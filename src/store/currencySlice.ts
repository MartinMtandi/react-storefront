import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'PULA' | 'RAND' | 'DIRHAM';

interface CurrencyState {
  selectedCurrency: Currency;
  rates: Record<Currency, number>;
}

const initialState: CurrencyState = {
  selectedCurrency: 'USD',
  rates: {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    PULA: 12.76,
    RAND: 18.95,
    DIRHAM: 3.67
  }
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<Currency>) => {
      state.selectedCurrency = action.payload;
    }
  }
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;

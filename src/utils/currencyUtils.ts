import { Currency } from '../store/currencySlice';

export const convertPrice = (price: number, fromCurrency: Currency, toCurrency: Currency, rates: Record<Currency, number>): number => {
  // Convert to USD first (base currency)
  const usdAmount = fromCurrency === 'USD' ? price : price / rates[fromCurrency];
  // Then convert to target currency
  const convertedAmount = toCurrency === 'USD' ? usdAmount : usdAmount * rates[toCurrency];
  return Number(convertedAmount.toFixed(2));
};

export const getCurrencySymbol = (currency: Currency): string => {
  switch (currency) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'PULA':
      return 'P';
    case 'RAND':
      return 'R';
    case 'DIRHAM':
      return 'د.إ';
    default:
      return '$';
  }
};

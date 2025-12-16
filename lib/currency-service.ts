export interface CurrencyInfo {
  currency: string;
  display: string;
  rate: number;
  originalAmount: number;
  convertedAmount: number;
}

export interface CountryData {
  countryCode: string;
  currencyCode: string;
  countryName: string;
  currencyName: string;
}

const CACHE_KEY = 'currency_data_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for country data
const RATES_CACHE_KEY = 'exchange_rates_cache';
const RATES_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for rates

export class CurrencyService {
  private static BASE_AMOUNT_USD = 4.99;

  // Get country data from REST Countries API
  static async getCountryCurrencyData(): Promise<CountryData[]> {
    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }

    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=cca2,currencies,name');
      if (!response.ok) throw new Error('Failed to fetch country data');
      
      const countries = await response.json();
      
      // Transform to our format
      const countryData: CountryData[] = countries.map((country: any) => {
        const currencyCode = Object.keys(country.currencies || {})[0] || 'USD';
        const currencyInfo = country.currencies?.[currencyCode];
        
        return {
          countryCode: country.cca2,
          currencyCode: currencyCode,
          countryName: country.name?.common || country.cca2,
          currencyName: currencyInfo?.name || currencyCode,
        };
      });

      // Cache the results
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: countryData,
        timestamp: Date.now()
      }));

      return countryData;
    } catch (error) {
      console.error('Error fetching country data:', error);
      // Return minimal fallback data
      return [
        { countryCode: 'US', currencyCode: 'USD', countryName: 'United States', currencyName: 'US Dollar' },
        { countryCode: 'GB', currencyCode: 'GBP', countryName: 'United Kingdom', currencyName: 'British Pound' },
        { countryCode: 'KE', currencyCode: 'KES', countryName: 'Kenya', currencyName: 'Kenyan Shilling' },
        { countryCode: 'NG', currencyCode: 'NGN', countryName: 'Nigeria', currencyName: 'Nigerian Naira' },
        { countryCode: 'ZA', currencyCode: 'ZAR', countryName: 'South Africa', currencyName: 'South African Rand' },
      ];
    }
  }

  // Get exchange rates from ExchangeRate-API
  static async getExchangeRates(): Promise<Record<string, number>> {
    // Check cache first
    const cached = localStorage.getItem(RATES_CACHE_KEY);
    if (cached) {
      const { rates, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < RATES_CACHE_DURATION) {
        return rates;
      }
    }

    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) throw new Error('Failed to fetch exchange rates');
      
      const data = await response.json();
      const rates = data.rates;
      
      // Cache the results
      localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({
        rates,
        timestamp: Date.now()
      }));
      
      return rates;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      // Return cached rates if available, or empty object
      const cached = localStorage.getItem(RATES_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached).rates;
      }
      return {};
    }
  }

  // Format currency display
  static formatCurrency(currencyCode: string, amount: number): string {
    try {
      // Special cases for currencies with unique symbols
      const specialSymbols: Record<string, string> = {
        KES: 'Ksh ',
        NGN: '₦',
        ZAR: 'R',
      };

      if (specialSymbols[currencyCode]) {
        return `${specialSymbols[currencyCode]}${amount.toFixed(2)}`;
      }

      // Use Intl.NumberFormat for proper formatting
      const localeMap: Record<string, string> = {
        USD: 'en-US',
        EUR: 'de-DE',
        GBP: 'en-GB',
        JPY: 'ja-JP',
        CNY: 'zh-CN',
        INR: 'en-IN',
        AUD: 'en-AU',
        CAD: 'en-CA',
      };

      const locale = localeMap[currencyCode] || 'en-US';
      
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      // Fallback formatting
      return `${currencyCode} ${amount.toFixed(2)}`;
    }
  }

  // Main function to get currency info for a country
  static async getCurrencyInfo(countryCode: string): Promise<CurrencyInfo> {
    try {
      // Get country data and exchange rates in parallel
      const [countryData, exchangeRates] = await Promise.all([
        this.getCountryCurrencyData(),
        this.getExchangeRates()
      ]);

      // Find the country's currency
      const countryInfo = countryData.find(c => c.countryCode === countryCode);
      const currencyCode = countryInfo?.currencyCode || 'USD';

      // Get exchange rate
      const rate = exchangeRates[currencyCode] || 1;
      const convertedAmount = this.BASE_AMOUNT_USD * rate;

      return {
        currency: currencyCode,
        display: this.formatCurrency(currencyCode, convertedAmount),
        rate,
        originalAmount: this.BASE_AMOUNT_USD,
        convertedAmount,
      };
    } catch (error) {
      console.error('Error getting currency info:', error);
      // Fallback to USD
      return {
        currency: 'USD',
        display: this.formatCurrency('USD', this.BASE_AMOUNT_USD),
        rate: 1,
        originalAmount: this.BASE_AMOUNT_USD,
        convertedAmount: this.BASE_AMOUNT_USD,
      };
    }
  }

  // Get all available countries for debugging/UI
  static async getAvailableCountries(): Promise<CountryData[]> {
    return this.getCountryCurrencyData();
  }
}
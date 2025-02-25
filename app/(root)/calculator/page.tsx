"use client"
import React, { useState, useEffect } from 'react';

interface CurrencyRates {
  [key: string]: number;
}

const CurrencyConverter: React.FC = () => {
  // State for currency data and user inputs
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [amount, setAmount] = useState<string>('1');
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [rates, setRates] = useState<CurrencyRates>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Fetch sample exchange rates (would be replaced with API call in production)
  useEffect(() => {
    // Simulating API fetch delay
    const timer = setTimeout(() => {
      // Sample data (in a real app, you would fetch from an API)
      const sampleRates: CurrencyRates = {
        USD: 1,
        EUR: 0.91,
        GBP: 0.78,
        JPY: 151.72,
        AUD: 1.52,
        CAD: 1.36,
        CHF: 0.89,
        CNY: 7.23,
        INR: 83.42,
        MXN: 16.74,
        SGD: 1.34,
        NZD: 1.63,
        BRL: 5.08,
        ZAR: 18.62
      };
      
      setRates(sampleRates);
      setCurrencies(Object.keys(sampleRates));
      setIsLoading(false);
      
      // Set last updated time
      const now = new Date();
      setLastUpdated(now.toLocaleString());
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Convert currency when any input changes
  useEffect(() => {
    if (!isLoading && fromCurrency && toCurrency && amount) {
      const amountNum = parseFloat(amount);
      if (!isNaN(amountNum)) {
        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];
        const result = (amountNum / fromRate) * toRate;
        setConvertedAmount(result.toFixed(2));
      }
    }
  }, [amount, fromCurrency, toCurrency, rates, isLoading]);

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Swap currencies
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Custom function to get popular conversions
  const getPopularConversions = () => {
    const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY'];
    const result = [];
    
    for (const currency of popularCurrencies) {
      if (currency !== fromCurrency && rates[currency] && rates[fromCurrency]) {
        result.push({
          from: fromCurrency,
          to: currency,
          rate: (rates[currency] / rates[fromCurrency]).toFixed(2)
        });
      }
    }
    
    if (result.length < 4 && !popularCurrencies.includes(fromCurrency)) {
      result.push({
        from: fromCurrency,
        to: 'USD',
        rate: (rates['USD'] / rates[fromCurrency]).toFixed(2)
      });
    }
    
    return result.slice(0, 4);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center  p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-4 text-white">
          <h1 className="text-2xl font-bold">Currency Converter</h1>
          {!isLoading && (
            <p className="text-xs mt-1 text-indigo-200">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter amount"
                />
              </div>

              <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                {/* From Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {currencies.map(currency => (
                      <option key={`from-${currency}`} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <button
                  onClick={handleSwapCurrencies}
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 p-2 rounded-full mt-6"
                  aria-label="Swap currencies"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>

                {/* To Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {currencies.map(currency => (
                      <option key={`to-${currency}`} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result */}
              <div className="mt-8 bg-indigo-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Converted Amount</div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-2xl font-bold text-gray-800">
                    {convertedAmount} {toCurrency}
                  </div>
                  <div className="text-sm text-gray-500">
                    1 {fromCurrency} = {(rates[toCurrency] / rates[fromCurrency]).toFixed(4)} {toCurrency}
                  </div>
                </div>
              </div>

              {/* Popular Conversions */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Conversions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {getPopularConversions().map((item, index) => (
                    <div key={index} className="bg-indigo-50 p-2 rounded">
                      1 {item.from} = {item.rate} {item.to}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
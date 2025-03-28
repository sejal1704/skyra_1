'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plane, Star, Clock, Wallet, Briefcase } from 'lucide-react';

// Types for Flight and Search Params
interface Flight {
  id: string;
  departure: string;
  arrival: string;
  airline: string;
  price: number;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  availableDays: string[];
  stops: number;
  aircraft: string;
  comfortScore: number;
  luggageAllowance: string;
  mealIncluded: boolean;
  departureAirport: string;
  arrivalAirport: string;
}

interface SearchParams {
  from: string;
  to: string;
  date: string;
  preferences?: {
    prioritizeCost?: boolean;
    prioritizeComfort?: boolean;
    prioritizeDuration?: boolean;
  };
}

interface FlightData {
  flights: Flight[];
  cities: string[];
}

// AI Recommendation Logic
function recommendFlights(
  flights: Flight[], 
  searchParams: SearchParams
): Flight[] {
  const filteredFlights = flights.filter(flight => 
    flight.departure === searchParams.from && 
    flight.arrival === searchParams.to &&
    flight.availableDays.includes(new Date(searchParams.date).toLocaleDateString('en-US', { weekday: 'long' }))
  );

  // If no preferences, default to balanced recommendation
  if (!searchParams.preferences) {
    return filteredFlights.sort((a, b) => {
      // Balanced scoring: 40% price, 30% comfort, 30% duration
      const scoreA = 
        (1 - a.price / 5000) * 0.4 + 
        (a.comfortScore / 10) * 0.3 + 
        (1 - parseFloat(a.duration) / 5) * 0.3;
      
      const scoreB = 
        (1 - b.price / 5000) * 0.4 + 
        (b.comfortScore / 10) * 0.3 + 
        (1 - parseFloat(b.duration) / 5) * 0.3;
      
      return scoreB - scoreA;
    });
  }

  // Customized AI recommendation based on preferences
  if (searchParams.preferences.prioritizeCost) {
    return filteredFlights.sort((a, b) => a.price - b.price);
  }

  if (searchParams.preferences.prioritizeComfort) {
    return filteredFlights.sort((a, b) => {
      // Consider comfort score, meal, luggage, and aircraft
      const getComfortScore = (flight: Flight) => {
        let score = flight.comfortScore;
        score += flight.mealIncluded ? 1 : 0;
        score += parseFloat(flight.luggageAllowance) / 10;
        return score;
      };
      return getComfortScore(b) - getComfortScore(a);
    });
  }

  if (searchParams.preferences.prioritizeDuration) {
    return filteredFlights.sort((a, b) => {
      const durationA = parseFloat(a.duration);
      const durationB = parseFloat(b.duration);
      return durationA - durationB;
    });
  }

  // Fallback to balanced recommendation
  return filteredFlights;
}

const FlightSearch: React.FC = () => {
  // Load flight data
  const [flightData, setFlightData] = useState<FlightData>({
    flights: [],
    cities: []
  });

  // Search parameters and results
  const [searchParams, setSearchParams] = useState<SearchParams>({
    from: '',
    to: '',
    date: '',
    preferences: {}
  });
  const [recommendedFlights, setRecommendedFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load flight data on component mount
  useEffect(() => {
    const loadFlightData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/flights');
        
        if (!response.ok) {
          throw new Error('Failed to fetch flight data');
        }
        
        const data = await response.json();
        setFlightData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load flight data', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadFlightData();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Prevent selecting same departure and arrival
    if (name === 'from' && value === searchParams.to) {
      alert('Departure and Arrival cities cannot be the same!');
      return;
    }
    
    if (name === 'to' && value === searchParams.from) {
      alert('Departure and Arrival cities cannot be the same!');
      return;
    }

    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle preference changes
  const handlePreferenceChange = (preference: keyof NonNullable<SearchParams['preferences']>) => {
    setSearchParams(prev => ({
      ...prev,
      preferences: {
        prioritizeCost: false,
        prioritizeComfort: false,
        prioritizeDuration: false,
        [preference]: true
      }
    }));
  };

  // Recommend flights
  const recommendFlightHandler = () => {
    if (!searchParams.from || !searchParams.to || !searchParams.date) {
      alert('Please fill all search parameters');
      return;
    }

    const recommended = recommendFlights(flightData.flights, searchParams);
    setRecommendedFlights(recommended);
  };

  // Prevent server-side rendering of this component
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
        <Plane className="mr-2 text-blue-600" /> Smart Flight Booking
      </h1>
      
      {/* Search Inputs */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <select 
          name="from"
          value={searchParams.from}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Departure</option>
          {flightData.cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <select 
          name="to"
          value={searchParams.to}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Arrival</option>
          {flightData.cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <input 
          type="date"
          name="date"
          value={searchParams.date}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* AI Preference Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => handlePreferenceChange('prioritizeCost')}
          className={`flex items-center px-4 py-2 rounded ${
            searchParams.preferences?.prioritizeCost 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          <Wallet className="mr-2" /> Best Price
        </button>
        <button
          onClick={() => handlePreferenceChange('prioritizeComfort')}
          className={`flex items-center px-4 py-2 rounded ${
            searchParams.preferences?.prioritizeComfort 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          <Star className="mr-2" /> Best Comfort
        </button>
        <button
          onClick={() => handlePreferenceChange('prioritizeDuration')}
          className={`flex items-center px-4 py-2 rounded ${
            searchParams.preferences?.prioritizeDuration 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          <Clock className="mr-2" /> Shortest Duration
        </button>
      </div>

      {/* Search Button */}
      <div className="text-center mb-6">
        <button 
          onClick={recommendFlightHandler}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition flex items-center mx-auto"
        >
          <Search className="mr-2" /> AI Recommend Flights
        </button>
      </div>

      {/* Recommended Flights */}
      {recommendedFlights.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">AI Recommended Flights</h2>
          {recommendedFlights.map(flight => (
            <div 
              key={flight.id} 
              className="border p-4 mb-4 rounded flex justify-between items-center hover:shadow-md transition"
            >
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">{flight.airline}</h3>
                  <span className="text-green-600 font-semibold">₹{flight.price}</span>
                </div>
                <p className="text-gray-600">{flight.departure} → {flight.arrival}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" /> {flight.duration}
                  </span>
                  <span className="flex items-center">
                    <Briefcase className="mr-1 h-4 w-4" /> {flight.luggageAllowance}
                  </span>
                  <span className="flex items-center">
                    <Star className="mr-1 h-4 w-4" /> Comfort: {flight.comfortScore}/10
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {flight.departureTime} - {flight.arrivalTime} | {flight.aircraft}
                </p>
              </div>
              <div className="ml-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : recommendedFlights.length === 0 && (searchParams.from && searchParams.to && searchParams.date) ? (
        <div className="text-center text-gray-500 mt-6">
          No flights found for the selected route and date.
        </div>
      ) : null}
    </div>
  );
};

export default FlightSearch;
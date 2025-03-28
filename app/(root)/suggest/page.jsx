"use client"
import React, { useState } from 'react';
import {  MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Comprehensive flight data with multiple routes
const mockFlightData = [
  // Delhi to Bangalore Routes
  {
    id: 'DEL-BLR-1',
    origin: 'Delhi',
    destination: 'Bangalore',
    airline: 'IndiGo',
    departureTime: '06:00 AM',
    arrivalTime: '08:30 AM',
    duration: '2h 30m',
    price: 3500,
    stops: 'Non-stop',
    rating: 4.5,
    recommendationScore: 9.2
  },
  {
    id: 'DEL-BLR-2',
    origin: 'Delhi',
    destination: 'Bangalore',
    airline: 'Air India',
    departureTime: '09:15 AM',
    arrivalTime: '11:45 AM',
    duration: '2h 30m',
    price: 4200,
    stops: 'Non-stop',
    rating: 4.2,
    recommendationScore: 8.7
  },
  // Bangalore to Delhi Routes
  {
    id: 'BLR-DEL-1',
    origin: 'Bangalore',
    destination: 'Delhi',
    airline: 'Vistara',
    departureTime: '02:00 PM',
    arrivalTime: '04:30 PM',
    duration: '2h 30m',
    price: 3800,
    stops: 'Non-stop',
    rating: 4.6,
    recommendationScore: 8.9
  },
  // Pune to Mumbai Routes
  {
    id: 'PNE-MUM-1',
    origin: 'Pune',
    destination: 'Mumbai',
    airline: 'SpiceJet',
    departureTime: '07:30 AM',
    arrivalTime: '08:45 AM',
    duration: '1h 15m',
    price: 2500,
    stops: 'Non-stop',
    rating: 4.0,
    recommendationScore: 8.5
  },
  {
    id: 'PNE-MUM-2',
    origin: 'Pune',
    destination: 'Mumbai',
    airline: 'GoAir',
    departureTime: '10:45 AM',
    arrivalTime: '12:00 PM',
    duration: '1h 15m',
    price: 2800,
    stops: '1 Stop',
    rating: 3.8,
    recommendationScore: 8.2
  },
  // Mumbai to Pune Routes
  {
    id: 'MUM-PNE-1',
    origin: 'Mumbai',
    destination: 'Pune',
    airline: 'IndiGo',
    departureTime: '05:15 PM',
    arrivalTime: '06:30 PM',
    duration: '1h 15m',
    price: 2600,
    stops: 'Non-stop',
    rating: 4.3,
    recommendationScore: 8.7
  },
  // Pune to Kolkata Routes
  {
    id: 'PNE-KOL-1',
    origin: 'Pune',
    destination: 'Kolkata',
    airline: 'Air India',
    departureTime: '08:00 AM',
    arrivalTime: '10:30 AM',
    duration: '2h 30m',
    price: 4000,
    stops: 'Non-stop',
    rating: 4.1,
    recommendationScore: 8.6
  },
  {
    id: 'PNE-KOL-2',
    origin: 'Pune',
    destination: 'Kolkata',
    airline: 'Vistara',
    departureTime: '11:30 AM',
    arrivalTime: '02:00 PM',
    duration: '2h 30m',
    price: 4500,
    stops: '1 Stop',
    rating: 4.4,
    recommendationScore: 8.3
  },
  // Pune to Delhi Routes
  {
    id: 'PNE-DEL-1',
    origin: 'Pune',
    destination: 'Delhi',
    airline: 'IndiGo',
    departureTime: '06:45 AM',
    arrivalTime: '09:15 AM',
    duration: '2h 30m',
    price: 3800,
    stops: 'Non-stop',
    rating: 4.2,
    recommendationScore: 8.8
  },
  // Delhi to Pune Routes
  {
    id: 'DEL-PNE-1',
    origin: 'Delhi',
    destination: 'Pune',
    airline: 'Vistara',
    departureTime: '03:30 PM',
    arrivalTime: '06:00 PM',
    duration: '2h 30m',
    price: 4200,
    stops: 'Non-stop',
    rating: 4.5,
    recommendationScore: 9.0
  },
  // Kolkata Routes
  {
    id: 'KOL-DEL-1',
    origin: 'Kolkata',
    destination: 'Delhi',
    airline: 'Air India',
    departureTime: '07:15 AM',
    arrivalTime: '09:45 AM',
    duration: '2h 30m',
    price: 3900,
    stops: 'Non-stop',
    rating: 4.3,
    recommendationScore: 8.7
  }
];

// List of unique cities
const CITIES = [
  'Delhi', 'Bangalore', 'Mumbai', 'Pune', 'Kolkata'
];

const AdvancedFlightRecommendationSystem = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [recommendedFlights, setRecommendedFlights] = useState([]);

  // Filter out destinations that match the origin
  const getAvailableDestinations = () => {
    return CITIES.filter(city => city !== origin);
  };

  const handleSearch = () => {
    // Validate inputs
    if (!origin || !destination || !date) {
      alert('Please fill in all fields');
      return;
    }

    // Filter flights matching origin and destination
    const matchedFlights = mockFlightData.filter(flight => 
      flight.origin === origin && 
      flight.destination === destination
    );

    // Sort by recommendation score
    const sortedFlights = matchedFlights.sort((a, b) => 
      b.recommendationScore - a.recommendationScore
    );

    setRecommendedFlights(sortedFlights);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Advanced Flight Recommendation System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origin City
              </label>
              <Select 
                value={origin} 
                onValueChange={setOrigin}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Origin City">
                    {origin || 'Select Origin City'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination City
              </label>
              <Select 
                value={destination} 
                onValueChange={setDestination}
                disabled={!origin}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Destination City">
                    {destination || 'Select Destination City'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDestinations().map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Date
              </label>
              <div className="relative">
                <Input 
                  type="date"
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full"
                />
                {/* <Calendar 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
                  size={20} 
                /> */}
              </div>
            </div>
          </div>
          <div className="text-center">
            <Button 
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!origin || !destination || !date}
            >
              Find Best Flights
            </Button>
          </div>

          {recommendedFlights.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Recommended Flights from {origin} to {destination}
              </h2>
              {recommendedFlights.map((flight, index) => (
                <Card 
                  key={flight.id} 
                  className={`mb-4 ${index === 0 ? 'border-2 border-green-500' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-bold text-lg">{flight.airline}</div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <MapPin size={16} className="mr-2 text-blue-500" />
                          {flight.origin} → {flight.destination}
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="font-semibold">{flight.departureTime} - {flight.arrivalTime}</div>
                        <div className="text-sm text-gray-600">{flight.duration}</div>
                        <div className="text-sm text-gray-600">{flight.stops}</div>
                      </div>
                      <div className="flex-1 text-right">
                        <div className="font-bold text-xl text-blue-600">
                          ₹{flight.price}
                        </div>
                        <div className="text-sm text-gray-600">
                          Rating: {flight.rating}/5
                        </div>
                      </div>
                    </div>
                    {index === 0 && (
                      <div className="mt-2 text-green-600 font-semibold text-center">
                        Top Recommended Flight
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              {origin && destination ? 
                'No flights found for selected route.' : 
                'Select origin and destination to find flights.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedFlightRecommendationSystem;
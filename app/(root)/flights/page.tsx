"use client"
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import FlightTicket from '@/components/FlightTicket'; 

interface FlightDetails {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    iata: string;
    icao: string;
    terminal: string | null;
    gate: string | null;
    scheduled: string;
  };
  arrival: {
    airport: string;
    iata: string;
    icao: string;
    terminal: string | null;
    gate: string | null;
    scheduled: string;
  };
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  flight: {
    number: string;
  };
}

const Flights = () => {
  const [alerts, setAlerts] = useState<FlightDetails[]>([]);

  useEffect(() => {
    const savedAlerts = JSON.parse(localStorage.getItem('alerts') || '[]');
    setAlerts(savedAlerts);
  }, []);

  return (
    <div className="">
      <Header title='Your Alerts' subtitle='Check the alerts you have added previously.' />
      <div className="container mx-auto px-4 py-8 min-h-screen mt-4">
        {alerts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {alerts.map((flight, index) => (
              <FlightTicket key={index} flight={flight} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No flight alerts yet.</p>
            <p className="mt-2 text-gray-500">Add some flights to start tracking them!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flights;
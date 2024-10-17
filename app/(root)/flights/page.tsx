"use client"
import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'

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
    <>
      <Header title='Your Alerts' subtitle='Check the alerts you have added previously.' />
      <div>
      {alerts.length > 0 ? (
        alerts.map((flight, index) => (
          <div key={index} className="flight-card">
            {/* Flight details without 'Create Alert' button */}
            <p>{flight.airline.name} {flight.flight.number}</p>
            <p>{flight.departure.airport} → {flight.arrival.airport}</p>
            <p>Departure: {flight.departure.scheduled}</p>
            {/* Additional flight info */}
          </div>
        ))
      ) : (
        <p>No flight alerts yet.</p>
      )}
      </div>
    </>
  )
}

export default Flights
import React from 'react';
import { Plane } from 'lucide-react';

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

const FlightTicket: React.FC<{ flight: FlightDetails }> = ({ flight }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-lg my-4 border border-gray-200">
      <div className="bg-indigo-600 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-bold">{flight.airline.name}</span>
        <span>{flight.flight.number}</span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-left">
            <p className="text-xs text-gray-500">Departure</p>
            <p className="text-lg font-semibold">{flight.departure.iata}</p>
            <p className="text-sm">{flight.departure.airport}</p>
          </div>
          <Plane className="text-indigo-600" />
          <div className="text-right">
            <p className="text-xs text-gray-500">Arrival</p>
            <p className="text-lg font-semibold">{flight.arrival.iata}</p>
            <p className="text-sm">{flight.arrival.airport}</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-semibold">{formatDate(flight.flight_date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-sm font-semibold">{flight.flight_status}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Departure Time</p>
              <p className="text-sm font-semibold">{formatDate(flight.departure.scheduled)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Arrival Time</p>
              <p className="text-sm font-semibold">{formatDate(flight.arrival.scheduled)}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs text-gray-500">Terminal / Gate</p>
          <p className="text-sm">
            Departure: {flight.departure.terminal || 'N/A'} / {flight.departure.gate || 'N/A'}
          </p>
          <p className="text-sm">
            Arrival: {flight.arrival.terminal || 'N/A'} / {flight.arrival.gate || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlightTicket;
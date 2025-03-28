// types/Flight.ts
export interface Airport {
    code: string;
    name: string;
    city: string;
    state: string;
  }
  
  export interface Flight {
    id: string;
    airline: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    duration: string;
    availableSeats: number;
  }
  
  export interface FlightSearchParams {
    departureAirport?: string;
    arrivalAirport?: string;
    departureDate?: string;
  }

// import type { NextApiRequest, NextApiResponse } from 'next';

// interface Passenger {
//   name: string;
//   seatNumber: string;
// }

// interface FlightDetails {
//   pnr: string;
//   email: string;
//   airline: string;
//   flightNumber: string;
//   departureTime: string;
//   arrivalTime: string;
//   origin: {
//     code: string;
//     name: string;
//     terminal: string;
//     gate: string;
//   };
//   destination: {
//     code: string;
//     name: string;
//     terminal: string;
//     gate: string;
//   };
//   passengers: Passenger[];
//   status: string;
//   baggageAllowance: string;
//   aircraft: string;
//   duration: string;
// }

// const flightDatabase: { [key: string]: FlightDetails } = {
//   'ABC123': {
//     pnr: 'ABC123',
//     email: 'john@email.com',
//     airline: 'Example Airlines',
//     flightNumber: 'EA123',
//     departureTime: '2023-05-20T10:00:00Z',
//     arrivalTime: '2023-05-20T12:00:00Z',
//     origin: {
//       code: 'JFK',
//       name: 'John F. Kennedy International Airport',
//       terminal: 'T4',
//       gate: 'G12',
//     },
//     destination: {
//       code: 'LAX',
//       name: 'Los Angeles International Airport',
//       terminal: 'T3',
//       gate: 'G5',
//     },
//     passengers: [
//       { name: 'John Doe', seatNumber: '12A' },
//       { name: 'Jane Doe', seatNumber: '12B' },
//     ],
//     status: 'On Time',
//     baggageAllowance: '1 piece, 23kg each',
//     aircraft: 'Boeing 787-9',
//     duration: '5h 0m',
//   },
// };

// export const POST = async (
//   req: NextApiRequest,
//   res: NextApiResponse<FlightDetails | { message: string }>
// ) => {
//   const { pnr, email } = req.body;

//   try {
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     if (pnr in flightDatabase) {
//       const flightDetails = flightDatabase[pnr];

//       if (email) {
//         res.status(200).json(flightDetails);
//       } else {
//         res.status(400).json({ message: 'Email is required' });
//       }
//     } else {
//       res.status(404).json({ message: 'Flight not found' });
//     }
//   } catch (error) {
//     console.error('Error fetching flight details:', error);
//     res.status(500).json({ message: 'Error fetching flight details' });
//   }
// };

// export const GET = (
//   _req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//   res.status(405).json({ message: 'GET method not allowed. Use POST instead.' });
// };


// import type { NextApiRequest, NextApiResponse } from 'next'

// interface Passenger {
//   name: string;
//   seatNumber: string;
// }

// interface FlightDetails {
//     pnr: string;
//     email: string;
//   airline: string;
//   flightNumber: string;
//   departureTime: string;
//   arrivalTime: string;
//   origin: {
//     code: string;
//     name: string;
//     terminal: string;
//     gate: string;
//   };
//   destination: {
//     code: string;
//     name: string;
//     terminal: string;
//     gate: string;
//   };
//   passengers: Passenger[];
//   status: string;
//   baggageAllowance: string;
//   aircraft: string;
//   duration: string;
// }


// const flightDatabase: { [key: string]: FlightDetails } = {
//   'ABC123': {
//         pnr: 'ABC123',
//       email:"john@email.com",
//     airline: 'Example Airlines',
//     flightNumber: 'EA123',
//     departureTime: '2023-05-20T10:00:00Z',
//     arrivalTime: '2023-05-20T12:00:00Z',
//     origin: {
//       code: 'JFK',
//       name: 'John F. Kennedy International Airport',
//       terminal: 'T4',
//       gate: 'G12',
//     },
//     destination: {
//       code: 'LAX',
//       name: 'Los Angeles International Airport',
//       terminal: 'T3',
//       gate: 'G5',
//     },
//     passengers: [
//       { name: 'John Doe', seatNumber: '12A' },
//       { name: 'Jane Doe', seatNumber: '12B' },
//     ],
//     status: 'On Time',
//     baggageAllowance: '1 piece, 23kg each',
//     aircraft: 'Boeing 787-9',
//     duration: '5h 0m',
//   },
  
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<FlightDetails | { message: string }>
// ) {
//   if (req.method === 'POST') {
//     const { pnr, email } = req.body;

//     try {
    
//       await new Promise(resolve => setTimeout(resolve, 1000));

 
//       if (pnr in flightDatabase) {
//         const flightDetails = flightDatabase[pnr];
        
     
//         if (email) {
//           res.status(200).json(flightDetails);
//         } else {
//           res.status(400).json({ message: 'Email is required' });
//         }
//       } else {
//         res.status(404).json({ message: 'Flight not found' });
//       }
//     } catch (error) {
//       console.error('Error fetching flight details:', error);
//       res.status(500).json({ message: 'Error fetching flight details' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).json({ message: `Method ${req.method} Not Allowed` });
//   }
// }
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { airline_name, flight_number } = await req.json();

  // Validate request body
  if (!airline_name || !flight_number) {
    return NextResponse.json({ message: 'Airline name and flight number are required' }, { status: 400 });
  }

  // Access key and API URL for AviationStack
  const access_key = '38275054a27c492ae6e43a14b2d7f163'; 
  const apiUrl = `https://api.aviationstack.com/v1/flights?access_key=${access_key}&flight_number=${flight_number}&airline_name=${airline_name}`;

  try {
    // Fetch flight data
    const response = await fetch(apiUrl);
    const data = await response.json();

    // If no flight data is found
    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ message: 'Flight not found' }, { status: 404 });
    }

    // Assuming we're interested in the first result
    const flightDetails = data.data[0];

    // Validate flight status (only return if status is 'scheduled' or 'delayed')
    const validStatuses = ['scheduled', 'delayed'];
    if (!validStatuses.includes(flightDetails.flight_status)) {
      return NextResponse.json({ message: 'Flight is not scheduled or delayed' }, { status: 400 });
    }

    // Return flight details if valid
    return NextResponse.json(flightDetails);
  } catch (err) {
    // Handle the error safely by ensuring it's an instance of Error
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json({ message: 'Error fetching flight details', err: errorMessage }, { status: 500 });
  }
}

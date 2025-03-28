
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



// import type { NextApiRequest, NextApiResponse } from 'next';


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { email, flightDetails } = req.body;

//   if (!email || !flightDetails) {
//     return res.status(400).json({ message: 'Invalid data' });
//   }

//   const transporter = nodemailer.createTransport({
//     service: 'SendGrid', // or another email provider
//     auth: {
//       user: process.env.SENDGRID_USERNAME,
//       pass: process.env.SENDGRID_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: 'your-email@example.com',
//     to: email,
//     subject: 'Flight Alert Created',
//     text: `Flight Alert Created for ${flightDetails.airline.name} ${flightDetails.flight.number}`,
//     html: `<p>Your flight alert for <strong>${flightDetails.airline.name} ${flightDetails.flight.number}</strong> has been created.</p>`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: 'Email sent successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error sending email', error });
//   }
// }



// This file has Errors
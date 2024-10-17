
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
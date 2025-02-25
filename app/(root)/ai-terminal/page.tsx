"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OpenAI } from "openai";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Import the flight bookings data - replace this with your actual import method
// For this example, I'm assuming you'll have the JSON in a separate file
import user from "@/user.json";
const API = "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"
const openai = new OpenAI({
  apiKey: API,
  dangerouslyAllowBrowser: true,
});

interface Message {
  sender: string;
  text: string;
}

interface FlightLocation {
  airport: string;
  city: string;
  terminal: string;
  gate: string;
  scheduledTime: string;
}

interface Baggage {
  checkedBags: number;
  checkedBagsWeight: number;
  weightUnit: string;
  cabinBags: number;
}

interface Booking {
  bookingReference: string;
  pnr: string;
  passengers: Array<{
    title: string;
    firstName: string;
    lastName: string;
    specialRequests: string[];
  }>;
  flights: Array<{
    flightNumber: string;
    airlineName: string;
    departure: FlightLocation;
    arrival: FlightLocation;
    seat: string;
    cabin: string;
    baggage: Baggage;
  }>;
}

export default function FlightAgent() {
  const [pnr, setPnr] = useState("");
  const [email, setEmail] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  const validateUser = () => {
    // Find the booking that matches the PNR and email
    const matchedBooking = user.find(
      (booking) => booking.pnr === pnr && booking.contactInfo.email === email
    );

    if (matchedBooking) {
      setAuthenticated(true);
      setCurrentBooking(matchedBooking);
      setMessages([
        {
          sender: "bot",
          text: `Welcome ${matchedBooking.passengers[0].firstName}! Ask me about your flight.`,
        },
      ]);
    } else {
      alert("Invalid PNR or email. Please try again.");
    }
  };

  const sendMessage = async () => {
    if (!userMessage.trim() || !currentBooking) return;

    const newMessages = [...messages, { sender: "user", text: userMessage }];
    setMessages(newMessages);
    setUserMessage("");
    setIsLoading(true);

    try {
      const flight = currentBooking.flights[0];
      const flightInfo = `
        Your flight ${flight.flightNumber} (${flight.airlineName}) 
        departs from ${flight.departure.airport} (${
        flight.departure.city
      }) at ${new Date(flight.departure.scheduledTime).toLocaleString()} 
        and arrives at ${flight.arrival.airport} (${
        flight.arrival.city
      }) at ${new Date(flight.arrival.scheduledTime).toLocaleString()}. 
        Your seat is ${flight.seat}. Terminal: ${
        flight.departure.terminal
      }, Gate: ${flight.departure.gate}.
        Cabin class: ${flight.cabin}. Baggage allowance: ${
        flight.baggage.checkedBags
      } checked bags (${flight.baggage.checkedBagsWeight}${
        flight.baggage.weightUnit
      }) and ${flight.baggage.cabinBags} cabin bag(s).
        Passenger: ${currentBooking.passengers[0].title} ${
        currentBooking.passengers[0].firstName
      } ${currentBooking.passengers[0].lastName}.
        Booking reference: ${currentBooking.bookingReference}.
        Special requests: ${currentBooking.passengers[0].specialRequests.join(
          ", "
        )}.
      `;

      const prompt = `User asked: "${userMessage}". Provide a helpful response based on this flight data: ${flightInfo}`;

      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful flight assistant. Provide concise and relevant information about the user's flight details. Format dates and times nicely.",
          },
          { role: "user", content: prompt },
        ],
      });

      setMessages([
        ...newMessages,
        {
          sender: "bot",
          text:
            aiResponse.choices[0].message.content ||
            "Sorry, I couldn't process that.",
        },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          sender: "bot",
          text: "Sorry, there was an error processing your request. Please try again.",
        },
      ]);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-4 text-white">
          <h1 className="text-2xl font-bold">AI Flight Assistant</h1>
        </div>

        {!authenticated ? (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Login to Your Flight
            </h2>
            <div className="space-y-4">
              <Input
                placeholder="Enter PNR (e.g. XYZ987, LMN456, DEF789)"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                className="w-full"
              />
              <Input
                placeholder="Enter Email (e.g. amit.sharma@email.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                type="email"
              />
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={validateUser}
              >
                Access My Flight
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[80vh]">
            <Card className="flex-grow m-4 overflow-hidden">
              <CardContent className="p-4 h-full overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg max-w-[80%] ${
                        msg.sender === "bot"
                          ? "bg-indigo-100 text-gray-800 mr-auto"
                          : "bg-indigo-600 text-white ml-auto"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="bg-indigo-100 text-gray-800 p-3 rounded-lg max-w-[80%] mr-auto flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating response...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <Input
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your flight..."
                  className="flex-grow"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !userMessage.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

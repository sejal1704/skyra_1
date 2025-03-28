"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { OpenAI } from "openai";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ChatCompletionMessageParam } from 'openai/resources/chat';

// Import the flight bookings data - replace this with your actual import method
import user from "@/user.json";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI || "",
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
  contactInfo: {
    email: string;
  };
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
  // const [conversationHistory, setConversationHistory] = useState<
  //   Array<{ role: string; content: string }>
  // >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationHistory, setConversationHistory] = useState<ChatCompletionMessageParam[]>([]);


  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const validateUser = () => {
    // Find the booking that matches the PNR and email
    const matchedBooking = user.find(
      (booking) => booking.pnr === pnr && booking.contactInfo.email === email
    );

    if (matchedBooking) {
      setAuthenticated(true);
      setCurrentBooking(matchedBooking);

      // Initialize with a welcoming message
      const welcomeMessage = `Welcome ${matchedBooking.passengers[0].firstName}! I'm your AI flight assistant. How can I help you today?`;
      setMessages([{ sender: "bot", text: welcomeMessage }]);

      // Initialize conversation history
      setConversationHistory([
        {
          role: "system",
          content: getSystemPrompt(matchedBooking),
        },
        {
          role: "assistant",
          content: welcomeMessage,
        },
      ]);
    } else {
      alert("Invalid PNR or email. Please try again.");
    }
  };

  const getSystemPrompt = (booking: Booking) => {
    const flight = booking.flights[0];
    const flightInfo = `
      Flight ${flight.flightNumber} (${flight.airlineName}) 
      departs from ${flight.departure.airport} (${
      flight.departure.city
    }) at ${new Date(flight.departure.scheduledTime).toLocaleString()} 
      and arrives at ${flight.arrival.airport} (${
      flight.arrival.city
    }) at ${new Date(flight.arrival.scheduledTime).toLocaleString()}. 
      Seat: ${flight.seat}. Terminal: ${flight.departure.terminal}, Gate: ${
      flight.departure.gate
    }.
      Cabin class: ${flight.cabin}. Baggage allowance: ${
      flight.baggage.checkedBags
    } checked bags (${flight.baggage.checkedBagsWeight}${
      flight.baggage.weightUnit
    }) and ${flight.baggage.cabinBags} cabin bag(s).
      Passenger: ${booking.passengers[0].title} ${
      booking.passengers[0].firstName
    } ${booking.passengers[0].lastName}.
      Booking reference: ${booking.bookingReference}.
      Special requests: ${booking.passengers[0].specialRequests.join(", ")}.
    `;
  
    return `You are a helpful and friendly flight assistant named SkyBuddy. You help passengers with their flight information and answer general travel questions.
    
    IMPORTANT GUIDELINES:
    1. Be conversational and friendly. Respond appropriately to greetings like "hi", "hello", etc.
    2. For general questions not related to flight details, provide helpful responses without making up information.
    3. When the user asks about their specific flight details, use ONLY the information provided below.
    4. Format dates, times, and information in a readable, user-friendly way.
    5. Keep responses concise but complete.
    6. If you don't know something, simply say so rather than making up an answer.
    7. Always maintain a helpful, positive tone.
    8. If the user asks for navigation help to reach the terminal or gate, provide helpful directions.
    
    FLIGHT INFORMATION:
    ${flightInfo}
    
    USER INFORMATION:
    Name: ${booking.passengers[0].title} ${booking.passengers[0].firstName} ${booking.passengers[0].lastName}
    Booking reference: ${booking.bookingReference}
    PNR: ${booking.pnr}
    
    TERMINAL NAVIGATION HELP:
    If the user asks for directions to reach ${flight.departure.terminal} or navigate the airport:
    - Suggest they can take a taxi directly to ${flight.departure.terminal} drop-off area
    - After entering the terminal building, they should look for the information boards
    - Direct them to check in at their airline's counter (${flight.airlineName})
    - Tell them they can find a Starbucks cafe near the central atrium 
    - From there, they should take the left corridor and follow signs to their gate
    - Security checkpoints are typically after check-in and before the gate area
    - Escalators to gates are usually past the duty-free shopping area
    - Gate ${flight.departure.gate} can be reached by following the directional signs in the terminal
    
    Always be specific about using the terminal number and gate information provided in the flight details and u can give different routes for each flight depending on the terminal`;
  };

  const sendMessage = async () => {
    if (!userMessage.trim() || !currentBooking) return;

    const newMessages = [...messages, { sender: "user", text: userMessage }];
    setMessages(newMessages);
    setUserMessage("");
    setIsLoading(true);

    try {
      // Update conversation history with user message
      const updatedHistory: ChatCompletionMessageParam[] = [
        ...conversationHistory,
        { role: "user", content: userMessage }
      ];
      
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: updatedHistory,
      });
      const botResponse =
        aiResponse.choices[0].message.content ||
        "Sorry, I couldn't process that.";

      // Update messages and conversation history
      setMessages([...newMessages, { sender: "bot", text: botResponse }]);
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant", content: botResponse },
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

  // Sample data for demonstration
  const populateSampleData = () => {
    setPnr("XYZ987");
    setEmail("amit.sharma@email.com");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-4 text-white">
          <h1 className="text-2xl font-bold">SkyBuddy AI Flight Assistant</h1>
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
              <div className="text-center">
                <button
                  onClick={populateSampleData}
                  className="text-indigo-600 text-sm underline mt-2"
                >
                  Use sample data
                </button>
              </div>
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
                      Thinking...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
            </Card>
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <Input
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
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
              <div className="mt-2 text-xs text-gray-500">
                Try asking about your flight details, baggage allowance, or just
                say hi!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

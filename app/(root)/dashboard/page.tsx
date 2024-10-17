"use client";
import { useState, FormEvent } from "react";
import Header from "@/components/Header";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

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

const Dashboard = () => {
  const router = useRouter();
  const [airline, setAirline] = useState<string>("");
  const [flightNumber, setFlightNumber] = useState<string>("");
  const [flightDetails, setFlightDetails] = useState<FlightDetails | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFlightDetails(null);

    try {
      const response = await fetch("/api/flightdetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          airline_name: airline,
          flight_number: flightNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch flight details");
      }

      const data: FlightDetails = await response.json();
      setFlightDetails(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error fetching flight details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async () => {
    try {
      const userResponse = await fetch("/api/user");
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const user = await userResponse.json();

      if (flightDetails) {
        const savedFlights = JSON.parse(localStorage.getItem("alerts") || "[]");
        localStorage.setItem(
          "alerts",
          JSON.stringify([...savedFlights, flightDetails])
        );

        await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.emailAddresses[0]?.emailAddress,
            flightDetails,
          }),
        });
        router.push("/flights");
      }
    } catch (error) {
      console.error("Error creating alert:", error);
    }
  };

  const calculateRemainingTime = (departureTime: string) => {
    const departureDate = new Date(departureTime);
    const now = new Date();
    const timeDiff = departureDate.getTime() - now.getTime();

    if (timeDiff <= 0) return "Flight has already taken off";

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  };

  const formatTime12Hour = (time: string) => {
    const date = new Date(time);
    return format(date, "hh:mm a"); // Format to 12-hour time
  };

  return (
    <>
      <Header
        title={`Dashboard`}
        subtitle={`Never Miss your Flights with Our Alerts`}
      />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Fetch Flight Details
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="airline" className="sr-only">
                Airline Name
              </label>
              <input
                id="airline"
                name="airline"
                type="text"
                required
                value={airline}
                onChange={(e) => setAirline(e.target.value)}
                placeholder="Enter Airline Name"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="flightNumber" className="sr-only">
                Flight Number
              </label>
              <input
                id="flightNumber"
                name="flightNumber"
                type="text"
                required
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="Enter Flight Number"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? "Loading..." : "Fetch Flight Details"}
              </button>
            </div>
          </form>

          {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}

          {flightDetails && (
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Flight Details
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200 ml-4">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Airline
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {flightDetails.airline.name} (IATA:{" "}
                      {flightDetails.airline.iata}, ICAO:{" "}
                      {flightDetails.airline.icao})
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Flight Number
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {flightDetails.flight.number}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Departure
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {flightDetails.departure.airport} (IATA:{" "}
                      {flightDetails.departure.iata}, ICAO:{" "}
                      {flightDetails.departure.icao})<br />
                      Terminal: {flightDetails.departure.terminal || "N/A"},
                      Gate: {flightDetails.departure.gate || "N/A"}
                      <br />
                      {formatTime12Hour(flightDetails.departure.scheduled)} (
                      {calculateRemainingTime(
                        flightDetails.departure.scheduled
                      )}
                      )
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Arrival
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {flightDetails.arrival.airport} (IATA:{" "}
                      {flightDetails.arrival.iata}, ICAO:{" "}
                      {flightDetails.arrival.icao})<br />
                      Terminal: {flightDetails.arrival.terminal || "N/A"}, Gate:{" "}
                      {flightDetails.arrival.gate || "N/A"}
                      <br />
                      {formatTime12Hour(flightDetails.arrival.scheduled)}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {flightDetails.flight_status}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="flex justify-end px-4 py-3 bg-gray-50 sm:px-6">
                <button
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleCreateAlert}
                >
                  Create Alert
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

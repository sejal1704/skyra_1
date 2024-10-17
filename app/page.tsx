import React from "react";
import { Plane, Bell, Search } from "lucide-react";

const FlightAlertsLandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <header className="container mx-auto py-6 px-4">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Plane className="h-8 w-8" />
            <span className="text-2xl font-bold">Skyra</span>
          </div>
          <div className="space-x-4">
            <a href="#features" className="hover:underline"></a>

            <button className="bg-yellow-400 py-2 px-6 hover:bg-yellow-300 ">
              <a href="/sign-in" className="hover:underline">
                Get Started
              </a>
            </button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Never Miss a Flight Again !
          </h1>
          <p className="text-xl mb-8">Get Realtime alerts for your Flight</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300">
            Start Adding Alerts
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-blur-lg">
            <Search className="h-12 w-12 mb-4 text-yellow-300" />
            <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
            <p>Find the best routes and dates for your travel plans.</p>
          </div>
          <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-blur-lg">
            <Bell className="h-12 w-12 mb-4 text-green-300" />
            <h3 className="text-xl font-semibold mb-2">Instant Alerts</h3>
            <p>We Help You navigate on the Airport with out Instant Alerts</p>
          </div>
          <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-blur-lg">
            <Plane className="h-12 w-12 mb-4 text-pink-300" />
            <h3 className="text-xl font-semibold mb-2">Wide Coverage</h3>
            <p>Track flights from hundreds of airlines worldwide.</p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
          <p className="text-xl mb-8">
            Join thousands of happy travelers who never missed their flights.
          </p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-r-full font-semibold hover:bg-yellow-300 transition duration-300 whitespace-nowrap"
            >
              Get Started
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-blue-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Skyra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FlightAlertsLandingPage;

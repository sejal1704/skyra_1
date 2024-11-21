import React from "react";
import Header from "@/components/Header";
import { Compass, MapPin, Eye, Clock } from 'lucide-react';

const ARNavigation = () => {
  return (
    <div className="min-h-screen ">
      <Header
        title="AR Navigation"
        subtitle="Move in Style With Our AR Navigation at the Airport"
      />
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Coming Soon</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              AR Navigation
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Experience the future of airport navigation with our cutting-edge AR technology.
            </p>
          </div>
          <div className="mt-20">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Compass className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Real-time Directions</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Get turn-by-turn navigation overlaid on your real-world view.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <MapPin className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Point of Interest Locator</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Easily find gates, restaurants, shops, and services within the airport.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Eye className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Augmented Reality Overlay</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  See helpful information and directions superimposed on your camera view.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Clock className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Time-to-Gate Estimates</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Get accurate estimates of how long it will take to reach your gate or any location.
                </dd>
              </div>
            </dl>
          </div>
          <div className="mt-20 text-center">
            <p className="text-xl text-gray-500">We are working hard to bring you this exciting feature.</p>
            <p className="mt-4 text-lg text-gray-600">Expected launch: Q4 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARNavigation;

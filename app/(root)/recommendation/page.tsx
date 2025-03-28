"use client"
import type { NextPage } from 'next';
import FlightSearch from '@/components/FlightSearch';

const FlightsPage: NextPage = () => {
  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <FlightSearch />
      </div>
    </div>
  );
};

export default FlightsPage;
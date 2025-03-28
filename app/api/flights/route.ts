import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Path to the JSON file
    const filePath = path.join(process.cwd(), 'lib/flights', 'data.json')
    
    // Read the JSON file
    const fileContents = await fs.readFile(filePath, 'utf8');
    const flightData = JSON.parse(fileContents);
    
    // Return the flight data
    return NextResponse.json(flightData, { status: 200 });
  } catch (error) {
    console.error('Error reading flights data:', error);
    
    return NextResponse.json({ 
      error: 'Unable to load flight data', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Optional: Handle other HTTP methods
export function HEAD() {
  return NextResponse.json({ method: 'HEAD' });
}

export function OPTIONS() {
  return NextResponse.json({ method: 'OPTIONS' });
}
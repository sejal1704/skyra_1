# Skyra - Flight Tracking & Recommendation System ✈️

A modern flight tracking and recommendation system that helps travelers find and monitor flights across major Indian cities. Never miss your flights with real-time alerts and smart recommendations!

## Features 🌟

- Real-time flight tracking and alerts
- Smart flight recommendations based on preferences
- Coverage of major Indian cities
- User-friendly dashboard
- Email notifications for flight updates
- Advanced flight search with multiple filters
- Mobile-responsive design
- Secure authentication with Clerk

## Tech Stack 🛠️

- **Frontend**:

  - Next.js 14 with App Router
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - Lucide Icons

- **Backend**:

  - Next.js API Routes
  - Aviation Stack API
  - Clerk Authentication

- **Development**:
  - ESLint
  - PostCSS
  - TypeScript

## Project Structure 📁

```
skyra_1/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (root)/            # Main application routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── FlightSearch.tsx  # Flight search interface
│   ├── FlightTicket.tsx  # Flight information display
│   └── Header.tsx        # Navigation header
├── lib/                   # Utility functions and data
│   └── flights/          # Flight-related data
└── types/                # TypeScript type definitions
```

## Getting Started 🚀

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/skyra.git
   cd skyra
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables in `.env.local`:

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features in Detail 📝

### Flight Search

- Search flights between major Indian cities
- Filter by airline, price, and departure time
- View detailed flight information
- Compare multiple flight options

### Flight Tracking

- Real-time flight status updates
- Email notifications for flight changes
- Track multiple flights simultaneously
- View historical flight data

### User Dashboard

- Personalized flight recommendations
- Saved flight searches
- Flight alerts management
- User preferences settings

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Flight Anime References 🎬

While you wait for your flight, why not check out these aviation-themed anime:

- **Porco Rosso** - A classic Studio Ghibli film about a World War I flying ace cursed to look like a pig
- **The Wind Rises** - Another Ghibli masterpiece about aircraft designer Jiro Horikoshi
- **Yakitate!! Japan** - While not directly about flights, it's about a passionate baker who travels across Japan
- **Girls und Panzer** - Features various military vehicles and aircraft in its action scenes

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- [Clerk](https://clerk.com/) for authentication
- [Aviation Stack](https://aviationstack.com/) for flight data
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

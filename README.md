# SectorOne - Weapon Intelligence System

A modern web application for identifying, analyzing, and categorizing weapon systems with AI-powered specifications and real-time data.

## Features

- **AI-Powered Search** - Identify any weapon system by name with detailed specifications
- **Smart Caching** - Instant load times for previously searched weapons (7-day cache)
- **Similar Weapons** - Discover related weapon systems based on type and characteristics
- **Search History** - Track and revisit your weapon searches
- **Favorites** - Save weapons for quick access
- **Categories** - Browse 12 weapon categories with famous examples
- **Wikipedia Integration** - Automatic image fetching for visual reference
- **Typo Correction** - Smart suggestions for misspelled weapon names

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Google Gemini API** for AI-powered weapon identification
- **Wikipedia API** for weapon images
- **LocalStorage** for caching and data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/Xeno-legit/W.I.git
cd W.I
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root directory
```env
GEMINI_API_KEY=your_api_key_here
GEMINI_API_KEY_2=your_backup_api_key_here
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Search** - Enter any weapon name (e.g., "AK-47", "M1 Abrams", "Desert Eagle")
2. **Explore** - View detailed specifications, origin, manufacturer, and technical analysis
3. **Save** - Add weapons to favorites by clicking the heart icon
4. **Browse** - Explore weapon categories to discover new systems
5. **History** - Access your search history for quick reference

## Project Structure

```
├── components/          # Reusable UI components
├── pages/              # Page components (History, Favorites, Categories)
├── services/           # API services (Gemini, Wikipedia)
├── utils/              # Utility functions (localStorage)
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## API Rate Limiting

The app includes smart rate limiting with:
- Dual API key support for failover
- Sequential loading to avoid rate limits
- 7-day caching to minimize API calls
- Automatic retry with delays

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is open source and available under the MIT License.

## Author

**Abdulhamid Ali**
- GitHub: [@Xeno-legit](https://github.com/Xeno-legit)
- LinkedIn: [Abdulhamid Ali](https://www.linkedin.com/in/abdulhamid-ali-11ba22315/)

---

Built with React & TypeScript | Powered by Wikipedia & Gemini API

# 🚀 Explore NASA - Space Data Explorer

A modern web application built with Next.js that allows users to explore NASA's vast collection of space data through various APIs.

## ✨ Features

- **Astronomy Picture of the Day (APOD)** - Daily stunning space imagery
- **Mars Rover Photos** - Explore photos from Curiosity, Opportunity, and Spirit rovers
- **Near Earth Objects** - Track asteroids and their close approaches to Earth
- **Earth Natural Events** - Monitor natural disasters and events worldwide
- **Mars Weather** - Historical weather data from Mars
- **NASA Media Search** - Search NASA's image and video library
- **Tech Transfer & Patents** - Discover NASA technologies available for licensing

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom space theme
- **UI Components**: Headless UI, Lucide React icons
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Maps**: Leaflet (for Earth events)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- NASA API Key (get one free at [api.nasa.gov](https://api.nasa.gov/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Explore-NASA-Space-Data-Explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   The project is already configured with your NASA API key in `.env.local`:
   ```env
   NASA_API_KEY=
   NEXT_PUBLIC_NASA_API_KEY=
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Key Configuration

### Current Setup
Your NASA API key is already integrated and configured in the project. The application will automatically use your personal API key instead of the demo key.

### API Key Benefits
- **Higher Rate Limits**: 1000 requests/hour vs 30 requests/hour for demo
- **Better Performance**: No throttling or delays
- **Full Access**: Access to all NASA API endpoints

### Manual Configuration (if needed)
If you need to change the API key:

1. Update `.env.local` with your new key
2. Or use the in-app API Key modal to set it temporarily

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── apod/              # Astronomy Picture of the Day
│   ├── asteroids/         # Near Earth Objects
│   ├── events/            # Earth Natural Events
│   ├── mars-rover/        # Mars Rover Photos
│   ├── mars-weather/      # Mars Weather Data
│   ├── search-media/      # NASA Media Search
│   └── tech-transfer/     # Tech Transfer & Patents
├── components/            # Reusable UI components
├── contexts/              # React Context providers
├── lib/                   # Utility functions and API calls
└── public/               # Static assets
```

## 🌟 Key Components

- **APIKeyContext**: Manages NASA API key state and rate limiting
- **Navigation**: Responsive navigation with API status indicator
- **APIKeyModal**: Interface for managing API keys
- **Footer**: Links to all sections and external resources

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|-----------|
| `NASA_API_KEY` | Server-side NASA API key | Yes |
| `NEXT_PUBLIC_NASA_API_KEY` | Client-side NASA API key | Yes |

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 NASA APIs Used

1. **APOD API** - Astronomy Picture of the Day
2. **Mars Rover Photos API** - Images from Mars rovers
3. **NeoWs API** - Near Earth Object Web Service
4. **EONET API** - Earth Observatory Natural Event Tracker
5. **InSight Weather API** - Mars weather data (historical)
6. **NASA Image and Video Library** - Media search
7. **TechTransfer API** - NASA patents and technologies

## 🎨 Design Features

- **Space Theme**: Custom color palette inspired by space
- **Responsive Design**: Works on all device sizes
- **Dark Mode**: Space-themed dark interface
- **Animations**: Subtle animations and transitions
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: Graceful error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- NASA for providing free access to their APIs
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All the open-source contributors

---

**Built with ❤️ for space enthusiasts and developers**

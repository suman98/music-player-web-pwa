# Music Player PWA

A modern music player web application built with React, Tailwind CSS, and the `@music-library/core` package. The app features a beautiful, responsive UI inspired by contemporary music streaming services.

## Features

- 🎵 **Modern UI**: Clean, responsive design with gradient backgrounds
- 📁 **Folder Selection**: Load music files from your local system
- ▶️ **Playback Controls**: Play, pause, skip, and volume control
- 📊 **Progress Bar**: Visual track progress with seek functionality
- 📝 **Track Information**: Display current track, artist, and waveform visualization
- 🎯 **Recently Played**: Quick access to recently played tracks
- 💡 **Recommendations**: "You Might Like" section for quick browsing
- 📱 **Mobile-First Design**: Optimized for mobile with tabbed navigation, scales beautifully to desktop
- ⚡ **Responsive Layout**: Single-column on mobile → Multi-panel on desktop
- 🖱️ **Touch-Optimized**: Touch-friendly interface with proper hit targets
- ✨ **Tailwind CSS Styling**: Component-based utility-first styling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The app will open automatically in your browser at `http://localhost:5173`

### Building

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage

1. Click the **"Load Music"** button to select a folder containing music files
2. The app will load and display all audio files from the selected folder
3. Click on any track to play it
4. Use the player controls to:
   - **Play/Pause**: Toggle playback
   - **Skip**: Move to next or previous track
   - **Volume**: Adjust playback volume
   - **Progress Bar**: Click to seek to any position in the track

## Project Structure

```
src/
├── main.tsx              # React entry point
├── App.tsx              # Main application component
├── index.css            # Tailwind CSS setup and custom styles
├── utils.ts             # Utility functions (time formatting, text truncation)
└── components/
    ├── CurrentlyPlaying.tsx    # Currently playing track display
    ├── PlayerControls.tsx      # Play/pause and volume controls
    ├── ProgressBar.tsx         # Track progress bar with seek
    ├── RecentlyPlayed.tsx      # Recently played tracks section
    ├── YouMightLike.tsx        # Recommended tracks section
    ├── LyricsDisplay.tsx       # Track details and waveform display
    └── TrackList.tsx           # Full playlist view
```

## Technologies Used

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **@music-library/core**: Music file loading and library management

## Styling

The app uses Tailwind CSS exclusively for styling. Custom utilities and components are defined in `src/index.css`:

- `.glass`: Glassmorphism effect for cards
- `.glass-sm`: Smaller glass effect
- `.btn-icon`: Icon button styling
- `.waveform`: Animated waveform visualization

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Mobile Responsiveness

The app is built with a **mobile-first approach**:

### Mobile (< 640px)
- Single-column layout with tabbed navigation
- Three main views: Now Playing, Playlist, Details
- Optimized touch targets (44x44px minimum)
- Horizontal scrolling for Recently Played cards

### Tablet (640px - 1024px)
- Similar mobile layout with improved spacing
- Larger touch targets
- Better readability

### Desktop (1024px+)
- Full three-panel layout automatically displayed
- Sidebars show "Recently Played" and "You Might Like"
- Tab navigation automatically hidden
- Hover states and interactions optimized for mouse

See [RESPONSIVE_DESIGN.md](RESPONSIVE_DESIGN.md) for detailed responsive design documentation.

## License

MIT

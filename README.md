# Flight Zone Exporter - Vue.js Frontend

A modern, beautiful Vue.js frontend for the Flight Zone Exporter API. Built with Vue 3, Vite, Tailwind CSS, and shadcn-vue components.

## Features

- **Modern UI/UX**: Beautiful interface with shadcn-vue components
- **Drag & Drop File Upload**: Easy file uploads with visual feedback
- **Step-by-Step Workflow**: Clear visual progress through processing steps
- **Real-time Feedback**: Loading states, error handling, and success messages
- **SPK Management**: Check and delete existing SPK data
- **API Integration**: Seamless connection to FastAPI backend
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Type-Safe**: Built with Vue 3 Composition API

## Tech Stack

- **Vue 3** - Progressive JavaScript Framework
- **Vite** - Next Generation Frontend Tooling
- **Tailwind CSS** - Utility-first CSS Framework
- **shadcn-vue** - Beautiful UI components (via Radix Vue)
- **Pinia** - State management
- **Axios** - HTTP client
- **Lucide Icons** - Beautiful icons
- **Vue Router** - Official router for Vue.js

## Quick Start

### Prerequisites

- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn
- FastAPI backend running (see [flight-zone-exporter](../flight-zone-exporter))

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your API URL (default: http://localhost:8000)
# VITE_API_URL=http://localhost:8000
```

### Development

```bash
# Start development server
npm run dev

# Open browser at http://localhost:3000
```

### Build for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── api/                  # API client & endpoints
│   ├── client.js        # Axios instance
│   └── flightZone.js    # API methods
├── assets/              # Static assets
│   └── index.css        # Global styles
├── components/          # Vue components
│   ├── ui/              # shadcn-vue UI components
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   ├── Input.vue
│   │   ├── Label.vue
│   │   ├── Alert.vue
│   │   └── Progress.vue
│   ├── FileUpload.vue   # Drag & drop file upload
│   ├── WorkflowSteps.vue # Progress indicator
│   └── SPKManagement.vue # SPK operations
├── lib/                 # Utilities
│   └── utils.js         # Helper functions
├── router/              # Vue Router
│   └── index.js
├── stores/              # Pinia stores
│   └── flightZone.js    # Main state management
├── views/               # Page components
│   └── HomeView.vue
├── App.vue              # Root component
└── main.js              # Entry point
```

## Workflow

The application guides users through a 4-step process:

### Step 1: Upload Files & Configuration
- Upload KML ZIP file
- Upload Excel file
- Enter SPK number
- Enter Key ID
- Optionally upload edited shapefile

### Step 2: Generate Shapefile (Optional)
- Generate shapefile from KML for QGIS editing
- Download shapefile for manual editing

### Step 3: Process Files
- Process KML and Excel files
- Generate final upload shapefile
- Download final ZIP

### Step 4: Upload to ArcGIS
- Upload processed shapefile to ArcGIS Feature Server
- Automatic deletion of existing SPK data (if exists)

## API Integration

The frontend connects to the FastAPI backend via Axios. API configuration is in `src/api/`:

```javascript
// Example API usage
import { flightZoneAPI } from '@/api/flightZone'

// Check SPK
const result = await flightZoneAPI.checkSPK('SPK-001')

// Upload files
const formData = new FormData()
formData.append('kml_zip', kmlFile)
formData.append('excel_file', excelFile)
formData.append('spk_number', 'SPK-001')
formData.append('key_id', 'KEY-001')

await flightZoneAPI.processComplete(formData)
```

## State Management

Using Pinia for state management. The main store is in `src/stores/flightZone.js`:

```javascript
import { useFlightZoneStore } from '@/stores/flightZone'

const store = useFlightZoneStore()

// State
store.kmlFile
store.excelFile
store.spkNumber
store.loading
store.error

// Actions
await store.processFiles()
await store.uploadToArcGIS()
```

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Add environment variable: `VITE_API_URL` = your API URL

3. **Done!** Your frontend will be live at `https://your-project.vercel.app`

### Deploy to Netlify

1. **Build**:
```bash
npm run build
```

2. **Deploy**:
   - Drag & drop `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
   - Or connect your Git repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variable: `VITE_API_URL`

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

## Environment Variables

Create a `.env` file:

```env
# API URL (required)
VITE_API_URL=http://localhost:8000

# For production, use your deployed API URL
# VITE_API_URL=https://your-api.vercel.app
```

## Customization

### Theme Colors

Edit `src/assets/index.css` to customize the color scheme:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... */
}
```

### Components

All UI components are in `src/components/ui/`. Customize them as needed:

- `Button.vue` - Buttons with variants
- `Card.vue` - Container cards
- `Input.vue` - Form inputs
- `Alert.vue` - Alert/notification boxes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

### Hot Module Replacement (HMR)

Vite provides instant HMR. Changes are reflected immediately without page reload.

### Debugging

- Use Vue DevTools browser extension
- Check browser console for errors
- Review Network tab for API calls

### Code Quality

```bash
# Lint code
npm run lint
```

## Troubleshooting

### API Connection Issues

If you see "Disconnected" in API Status:

1. Check FastAPI backend is running
2. Verify `VITE_API_URL` in `.env`
3. Check CORS settings in FastAPI backend
4. Check browser console for errors

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
```

### File Upload Issues

- Check file size limits (default: 100MB)
- Verify file extensions (.zip, .xlsx, .xls, .xlsm)
- Check browser console for errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

© 2025 Radinal Dewantara Husein

## Related Projects

- [Flight Zone Exporter API](../flight-zone-exporter) - FastAPI backend

## Support

For issues and questions:
- Check the [API Documentation](../flight-zone-exporter/API_README.md)
- Review browser console errors
- Check FastAPI backend logs

---

Made with ❤️ using Vue.js and shadcn-vue

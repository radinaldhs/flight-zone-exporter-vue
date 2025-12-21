# Quick Start Guide

Get your Vue.js frontend running in 5 minutes!

## Step 1: Install Dependencies (2 minutes)

```bash
cd flight-zone-exporter-vue
npm install
```

This will install:
- Vue 3
- Vite
- Tailwind CSS
- shadcn-vue components
- Pinia (state management)
- Axios (API client)
- All other dependencies

## Step 2: Configure Environment (1 minute)

```bash
# Create .env file
cp .env.example .env
```

Edit `.env` if needed:
```env
VITE_API_URL=http://localhost:8000
```

Make sure your FastAPI backend is configured to allow CORS from `http://localhost:3000`.

## Step 3: Start Development Server (1 minute)

```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Step 4: Start Using! (1 minute)

1. **Check API Status**: Look at the sidebar - should show "Connected" (green dot)
2. **Upload Files**: Drag & drop or click to upload KML and Excel files
3. **Enter SPK & Key ID**: Fill in the required fields
4. **Process**: Click "Process Files" button
5. **Upload**: Click "Upload to ArcGIS" when ready

## Complete Workflow Example

### Option 1: Quick Upload (No QGIS Editing)

1. Upload KML ZIP
2. Upload Excel file
3. Enter SPK number and Key ID
4. Click "Process Files"
5. Click "Upload to ArcGIS"

### Option 2: With QGIS Editing

1. Upload KML ZIP
2. Enter SPK number
3. Click "Generate Shapefile"
4. Click "Download for Edit"
5. Edit in QGIS and save
6. Upload the edited shapefile
7. Upload Excel file
8. Enter Key ID
9. Click "Process Files"
10. Click "Upload to ArcGIS"

## Troubleshooting

### "API Disconnected" Error

**Problem**: Red dot showing "Disconnected" in API Status

**Solutions**:
1. Check FastAPI backend is running:
   ```bash
   cd ../flight-zone-exporter
   uvicorn app.main:app --reload
   ```

2. Verify `.env` has correct API URL:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

3. Check FastAPI CORS settings in `app/main.py`:
   ```python
   allow_origins=["http://localhost:3000"]
   ```

### File Upload Not Working

**Problem**: Files don't upload or show errors

**Solutions**:
1. Check file size (must be under 4.5MB for Vercel)
2. Verify file extension (.zip, .xlsx, .xls, .xlsm)
3. Check browser console (F12) for errors
4. Try different browser

### Build Errors

**Problem**: `npm run build` fails

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Port Already in Use

**Problem**: Port 3000 already in use

**Solution**:
```bash
# Use different port
npm run dev -- --port 3001
```

Or kill the process using port 3000:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Next Steps

### Deploy to Production

See [README.md](README.md#deployment) for deployment guides:
- Vercel (recommended)
- Netlify
- GitHub Pages

### Customize

1. **Theme Colors**: Edit `src/assets/index.css`
2. **Components**: Modify files in `src/components/`
3. **Logo**: Replace `Plane` icon in `App.vue`

## Development Tips

### Vue DevTools

Install [Vue DevTools](https://devtools.vuejs.org/) browser extension for debugging:
- View component hierarchy
- Inspect Pinia store
- Debug props and state

### Auto-formatting

```bash
# Install Prettier (optional)
npm install -D prettier

# Format code
npx prettier --write src/
```

### Hot Module Replacement

Vite provides instant HMR. Save your files and see changes immediately!

## Keyboard Shortcuts

- `Ctrl/Cmd + Shift + R` - Hard reload (clear cache)
- `F12` - Open browser DevTools
- `Ctrl/Cmd + K` - Clear console

## File Structure Overview

```
src/
├── api/          # API client
├── components/   # UI components
│   └── ui/       # shadcn-vue components
├── stores/       # Pinia state
├── views/        # Pages
├── App.vue       # Root component
└── main.js       # Entry point
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Lint code

# Dependencies
npm install              # Install dependencies
npm update               # Update dependencies
npm outdated             # Check outdated packages
```

## Resources

- [Vue 3 Docs](https://vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Pinia Docs](https://pinia.vuejs.org/)

## Getting Help

1. Check browser console (F12)
2. Review FastAPI backend logs
3. Check Network tab for failed requests
4. Review this guide's troubleshooting section

## Success! 🎉

If you can:
- ✅ See "Connected" API status
- ✅ Upload files successfully
- ✅ Process files without errors
- ✅ Upload to ArcGIS

**You're all set!** Enjoy using the Flight Zone Exporter.

---

Need more help? Check the full [README.md](README.md)

© 2025 Radinal Dewantara Husein

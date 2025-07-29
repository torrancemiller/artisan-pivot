# 🎮 Artisan Pivot

A futuristic vaporwave logic puzzle game where players help an artisan craft sculptures by routing tool instructions through a colorful workflow system. Built with HTML5, CSS3, JavaScript, and Phaser.js.

## 🌟 Features

- **🎨 Vaporwave Aesthetic**: Neon colors, animated grids, and synthwave styling
- **🧠 Logic Puzzle Gameplay**: Drag-and-drop node connections to create workflows
- **⏱️ Time-Based Challenges**: 5-minute levels with progressive difficulty
- **🎯 Multiple Levels**: 3 different sculpture sequences to master
- **📱 Mobile-Friendly**: Responsive design that works on desktop and mobile
- **⚡ Real-Time Feedback**: Glowing effects and visual celebrations

## 🕹️ How to Play

1. **Connect the Nodes**: Click and drag between colored workflow nodes (Cut, Carve, Polish, Assemble)
2. **Follow the Sequence**: Create the correct workflow path shown at the top
3. **Beat the Timer**: Complete each sculpture within 5 minutes
4. **Progress Through Levels**: Master all 3 levels to become a neural matrix artisan

## 🚀 How to Ship

### Option 1: Laravel Cloud (Recommended)

Laravel Cloud makes deployment incredibly simple:

1. **Prepare Your Files**:
   ```bash
   # Ensure all files are in your project directory
   ls -la
   # Should show: index.html, game.js, assets/images/
   ```

2. **Upload to Laravel Cloud**:
   - Log into your Laravel Cloud dashboard
   - Create a new project or select existing
   - Upload your project files via the web interface or Git
   - Laravel Cloud will automatically serve static files

3. **Configure Domain** (Optional):
   - Set up a custom domain in Laravel Cloud settings
   - Enable HTTPS (automatically handled by Laravel Cloud)

### Option 2: GitHub Pages

For free hosting with GitHub:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy Artisan Pivot game"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "Deploy from a branch" → "main"
   - Your game will be available at `https://yourusername.github.io/artisan-pivot`

### Option 3: Netlify

1. **Deploy via Drag & Drop**:
   - Go to [netlify.com](https://netlify.com)
   - Drag your project folder to the deploy area
   - Get instant HTTPS domain

2. **Or Connect Git Repository**:
   - Connect your GitHub repo
   - Auto-deploy on every push

### Option 4: Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   # Follow the prompts
   ```

### Option 5: Traditional Web Hosting

For shared hosting providers (Hostinger, Bluehost, etc.):

1. **Create Deployment Package**:
   ```bash
   # Create a zip file with all game files
   zip -r artisan-pivot.zip index.html game.js assets/
   ```

2. **Upload via FTP/cPanel**:
   - Extract files to your web root directory (usually `public_html/`)
   - Ensure file permissions are set correctly (644 for files, 755 for directories)

## 📁 Project Structure

```
artisan-pivot/
├── index.html          # Main game page
├── game.js            # Phaser.js game logic
├── assets/
│   └── images/
│       ├── artisan.jpg # Artisan character image
│       └── pivot.jpg   # Pivot workflow board
└── README.md          # This file
```

## 🛠️ Local Development

1. **Clone the Repository**:
   ```bash
   git clone <your-repo-url>
   cd artisan-pivot
   ```

2. **Start Local Server**:
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Or Python 2
   python -m SimpleHTTPServer 8000
   
   # Or Node.js
   npx serve .
   ```

3. **Open in Browser**:
   ```
   http://localhost:8000
   ```

## 🔧 Customization

### Modify Game Levels

Edit the `levels` object in `game.js`:

```javascript
const levels = {
    1: ['cut', 'carve', 'polish', 'assemble'],
    2: ['cut', 'polish', 'carve', 'assemble'],
    3: ['carve', 'cut', 'assemble', 'polish'],
    4: ['your', 'custom', 'sequence', 'here']  // Add new levels
};
```

### Change Colors

Update the color palette in `game.js`:

```javascript
const colors = {
    neonPink: 0xff0080,
    neonCyan: 0x00ffff,
    neonPurple: 0x8000ff,
    neonOrange: 0xff6600,
    // Add your custom colors
};
```

### Adjust Timer

Modify the timer duration in `game.js`:

```javascript
let timer = 300; // 5 minutes (300 seconds) - change as needed
```

## 🎨 Assets

The game uses two main images:
- `assets/images/artisan.jpg`: The artisan character
- `assets/images/pivot.jpg`: The workflow board with nodes

**Note**: Images can be modified as long as they maintain the same general layout for node positioning.

## 📱 Mobile Optimization

The game is optimized for mobile devices with:
- Responsive canvas sizing
- Touch-friendly interactions
- Mobile-optimized fonts and UI elements

## 🐛 Troubleshooting

### Images Not Loading
- Ensure images are in `assets/images/` directory
- Check file permissions (644 for files)
- Verify file extensions match (`.jpg` not `.jpeg`)

### Game Not Starting
- Check browser console for JavaScript errors
- Ensure you're serving files via HTTP (not opening index.html directly)
- Verify Phaser.js CDN is accessible

### Performance Issues
- Check if images are too large (optimize to < 500KB each)
- Ensure browser supports WebGL/Canvas

## 📄 License

This project is open source. Feel free to modify and distribute according to your needs.

## 🎯 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Game Engine**: Phaser.js 3.55.2
- **Styling**: CSS Grid, Flexbox, CSS Animations
- **Fonts**: Google Fonts (Orbitron, Rajdhani)
- **Hosting**: Laravel Cloud ready, works with any static hosting

---

**Ready to ship your neural matrix crafting experience!** 🚀✨
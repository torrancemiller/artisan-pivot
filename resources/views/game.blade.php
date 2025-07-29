<!DOCTYPE html>
<html>
<head>
    <title>Artisan Pivot - Logic Puzzle Game</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        body { 
            margin: 0; 
            background: linear-gradient(45deg, #0a0a0f 0%, #1a0a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%);
            background-attachment: fixed;
            font-family: 'Rajdhani', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }
        
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 80%, rgba(255, 0, 150, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
                linear-gradient(90deg, transparent 0%, rgba(255, 0, 150, 0.03) 50%, transparent 100%);
            pointer-events: none;
            z-index: -1;
        }
        
        canvas { 
            display: block; 
            margin: 20px auto; 
            border: 2px solid;
            border-image: linear-gradient(45deg, #ff0080, #00ffff, #ff0080) 1;
            border-radius: 15px;
            box-shadow: 
                0 0 30px rgba(255, 0, 128, 0.4),
                0 0 60px rgba(0, 255, 255, 0.2),
                inset 0 0 20px rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.3);
        }
        
        .game-title {
            font-family: 'Orbitron', monospace;
            font-weight: 900;
            background: linear-gradient(45deg, #ff0080, #00ffff, #ff6600, #ff0080);
            background-size: 400% 400%;
            animation: gradientShift 3s ease infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-align: center;
            font-size: 3em;
            margin: 20px 0 10px 0;
            text-shadow: 
                0 0 10px rgba(255, 0, 128, 0.5),
                0 0 20px rgba(0, 255, 255, 0.3),
                0 0 30px rgba(255, 102, 0, 0.2);
            letter-spacing: 3px;
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .game-subtitle {
            font-family: 'Rajdhani', sans-serif;
            font-weight: 300;
            color: #00ffff;
            text-align: center;
            font-size: 1.4em;
            margin-bottom: 20px;
            text-shadow: 
                0 0 10px rgba(0, 255, 255, 0.6),
                0 0 20px rgba(0, 255, 255, 0.3);
            letter-spacing: 1px;
        }
        
        .instructions {
            font-family: 'Rajdhani', sans-serif;
            font-weight: 400;
            color: #ffffff;
            text-align: center;
            max-width: 700px;
            margin: 20px auto;
            padding: 20px;
            font-size: 1.1em;
            background: linear-gradient(135deg, rgba(255, 0, 128, 0.1), rgba(0, 255, 255, 0.1));
            border: 1px solid;
            border-image: linear-gradient(45deg, #ff0080, #00ffff) 1;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 
                0 8px 32px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .instructions strong {
            color: #ff0080;
            text-shadow: 0 0 5px rgba(255, 0, 128, 0.5);
        }
        
        .neon-glow {
            animation: neonGlow 2s ease-in-out infinite alternate;
        }
        
        @keyframes neonGlow {
            from {
                text-shadow: 
                    0 0 5px #00ffff,
                    0 0 10px #00ffff,
                    0 0 15px #00ffff;
            }
            to {
                text-shadow: 
                    0 0 10px #00ffff,
                    0 0 20px #00ffff,
                    0 0 30px #00ffff,
                    0 0 40px #00ffff;
            }
        }
    </style>
</head>
<body>
    <h1 class="game-title">🎮 ARTISAN PIVOT 🎮</h1>
    <p class="game-subtitle neon-glow">NEURAL WORKFLOW MATRIX • SYNTHCRAFT PROTOCOL</p>
    
    <script src="phaser.min.js"></script>
    <script src="game.js"></script>
    
    <div class="instructions">
        <p>⚡ <strong>INTERFACE PROTOCOL:</strong> Master 15 increasingly challenging levels of neural workflow synthesis. Connect nodes in the correct sequence to craft perfect sculptures!</p>
        <p>🔮 <strong>DIFFICULTY PROGRESSION:</strong> TUTORIAL → INTERMEDIATE → ADVANCED → EXPERT → MASTER</p>
        <p>⏱️ <strong>TIME PRESSURE:</strong> Each level has decreasing time limits. Master levels give you only 70-90 seconds!</p>
        <p>🎯 <strong>COMPLEX SEQUENCES:</strong> Advanced levels require multiple uses of the same tools in specific orders.</p>
    </div>
</body>
</html>
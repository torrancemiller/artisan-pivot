const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#0a0a0f',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

// Game state variables
let nodes = [];
let connections = [];
let selectedNode = null;
let dragLine = null;
let graphics;
let currentLevel = 1;
let timer = 300; // 5 minutes in seconds
let timerText;
let levelText;
let instructionText;
let gameStarted = false;
let gameWon = false;
let nodeHighlights = [];
let backgroundGrid;

// Vaporwave color palette
const colors = {
    neonPink: 0xff0080,
    neonCyan: 0x00ffff,
    neonPurple: 0x8000ff,
    neonOrange: 0xff6600,
    neonGreen: 0x00ff80,
    darkPurple: 0x1a0a2e,
    darkBlue: 0x0f3460
};

// Define the correct sequence for each level
const levels = {
    1: ['cut', 'carve', 'polish', 'assemble'],
    2: ['cut', 'polish', 'carve', 'assemble'],
    3: ['carve', 'cut', 'assemble', 'polish']
};

function preload() {
    this.load.image('artisan', 'assets/images/artisan.jpg');
    this.load.image('pivot', 'assets/images/pivot.jpg');
}

function create() {
    // Create animated grid background
    createGridBackground.call(this);
    
    // Add background images with neon effects
    const pivotImage = this.add.image(400, 300, 'pivot');
    pivotImage.setAlpha(0.6);
    pivotImage.setTint(0x8800ff);
    
    const artisanImage = this.add.image(150, 300, 'artisan');
    artisanImage.setScale(0.75);
    artisanImage.setAlpha(0.8);
    artisanImage.setTint(0x00ffff);

    // Create graphics object for drawing lines
    graphics = this.add.graphics();

    const nodeData = [
        { name: 'cut', x: 350, y: 150, width: 100, height: 100, color: colors.neonPink },
        { name: 'carve', x: 550, y: 150, width: 100, height: 100, color: colors.neonCyan },
        { name: 'polish', x: 350, y: 350, width: 100, height: 100, color: colors.neonPurple },
        { name: 'assemble', x: 550, y: 350, width: 100, height: 100, color: colors.neonOrange }
    ];

    nodeData.forEach((nodeInfo, index) => {
        const node = this.add.zone(nodeInfo.x, nodeInfo.y, nodeInfo.width, nodeInfo.height).setInteractive();
        node.nodeData = nodeInfo;
        nodes.push(node);

        // Create multiple highlight circles for neon glow effect
        const highlight1 = this.add.circle(nodeInfo.x, nodeInfo.y, 70, nodeInfo.color, 0);
        const highlight2 = this.add.circle(nodeInfo.x, nodeInfo.y, 50, 0xffffff, 0);
        nodeHighlights.push({ outer: highlight1, inner: highlight2 });

        // Start connection on mousedown
        node.on('pointerdown', (pointer, localX, localY, event) => {
            if (!selectedNode && !gameWon) {
                selectedNode = node;
                dragLine = { startX: nodeInfo.x, startY: nodeInfo.y, endX: pointer.x, endY: pointer.y };
                event.stopPropagation();
                
                // Neon selection effect
                highlight1.setAlpha(0.4);
                highlight2.setAlpha(0.2);
                
                if (!gameStarted) {
                    gameStarted = true;
                }
            }
        });

        // Complete connection on mouseup
        node.on('pointerup', () => {
            if (selectedNode && selectedNode !== node && !gameWon) {
                // Create connection between selectedNode and this node
                const connection = {
                    from: selectedNode.nodeData,
                    to: node.nodeData
                };
                connections.push(connection);
                console.log(`Connected ${selectedNode.nodeData.name} to ${node.nodeData.name}`);
                
                // Add vaporwave connection effect
                const connectionEffect1 = this.add.circle(node.x, node.y, 40, colors.neonCyan, 0.8);
                const connectionEffect2 = this.add.circle(node.x, node.y, 20, colors.neonPink, 0.6);
                
                this.tweens.add({
                    targets: [connectionEffect1, connectionEffect2],
                    scaleX: 3,
                    scaleY: 3,
                    alpha: 0,
                    duration: 800,
                    ease: 'Power2',
                    onComplete: () => {
                        connectionEffect1.destroy();
                        connectionEffect2.destroy();
                    }
                });
                
                // Check if level is complete
                checkWinCondition();
            }
            
            // Clear all highlights
            nodeHighlights.forEach(h => {
                h.outer.setAlpha(0);
                h.inner.setAlpha(0);
            });
            selectedNode = null;
            dragLine = null;
        });

        // Add hover effects with neon glow
        node.on('pointerover', () => {
            if (!selectedNode) {
                highlight1.setAlpha(0.2);
                highlight2.setAlpha(0.1);
            }
        });

        node.on('pointerout', () => {
            if (!selectedNode) {
                highlight1.setAlpha(0);
                highlight2.setAlpha(0);
            }
        });

        // Add futuristic node visuals
        const nodeGraphics = this.add.graphics();
        
        // Outer glow
        nodeGraphics.fillStyle(nodeInfo.color, 0.2);
        nodeGraphics.fillRoundedRect(node.x - node.width / 2 - 10, node.y - node.height / 2 - 10, node.width + 20, node.height + 20, 15);
        
        // Main border
        nodeGraphics.lineStyle(3, nodeInfo.color, 0.9);
        nodeGraphics.strokeRoundedRect(node.x - node.width / 2, node.y - node.height / 2, node.width, node.height, 12);
        
        // Inner highlight
        nodeGraphics.lineStyle(1, 0xffffff, 0.6);
        nodeGraphics.strokeRoundedRect(node.x - node.width / 2 + 5, node.y - node.height / 2 + 5, node.width - 10, node.height - 10, 8);
        
        // Add futuristic node label
        this.add.text(nodeInfo.x, nodeInfo.y, nodeInfo.name.toUpperCase(), {
            fontSize: '14px',
            fill: '#ffffff',
            align: 'center',
            fontFamily: 'Orbitron, monospace',
            fontWeight: 'bold',
            stroke: nodeInfo.color,
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Add small corner indicators
        const corner1 = this.add.rectangle(node.x - 35, node.y - 35, 8, 8, nodeInfo.color);
        const corner2 = this.add.rectangle(node.x + 35, node.y + 35, 8, 8, nodeInfo.color);
        corner1.setAlpha(0.7);
        corner2.setAlpha(0.7);
    });

    // Handle mouse movement for drag line
    this.input.on('pointermove', (pointer) => {
        if (dragLine) {
            dragLine.endX = pointer.x;
            dragLine.endY = pointer.y;
        }
    });

    // Cancel connection on background click
    this.input.on('pointerup', () => {
        if (selectedNode) {
            nodeHighlights.forEach(h => {
                h.outer.setAlpha(0);
                h.inner.setAlpha(0);
            });
            selectedNode = null;
            dragLine = null;
        }
    });

    // Add futuristic UI elements
    timerText = this.add.text(580, 20, `⚡ ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`, {
        fontSize: '16px',
        fill: '#00ffff',
        fontFamily: 'Orbitron, monospace',
        backgroundColor: '#1a0a2e',
        padding: { x: 12, y: 6 },
        stroke: '#00ffff',
        strokeThickness: 1
    });

    levelText = this.add.text(580, 50, `🔮 LEVEL ${currentLevel}`, {
        fontSize: '14px',
        fill: '#ff0080',
        fontFamily: 'Orbitron, monospace',
        backgroundColor: '#1a0a2e',
        padding: { x: 12, y: 6 },
        stroke: '#ff0080',
        strokeThickness: 1
    });

    instructionText = this.add.text(30, 20, `🎯 SEQUENCE: ${levels[currentLevel].join(' → ').toUpperCase()}`, {
        fontSize: '14px',
        fill: '#00ff80',
        fontFamily: 'Rajdhani, sans-serif',
        backgroundColor: '#0a0a0f',
        padding: { x: 12, y: 6 },
        stroke: '#00ff80',
        strokeThickness: 1
    });

    // Add futuristic reset button
    const resetButton = this.add.text(580, 80, '⟲ RESET', {
        fontSize: '14px',
        fill: '#ffffff',
        fontFamily: 'Orbitron, monospace',
        backgroundColor: '#ff6600',
        padding: { x: 12, y: 6 },
        stroke: '#ffffff',
        strokeThickness: 1
    }).setInteractive();

    resetButton.on('pointerdown', () => {
        resetLevel();
        
        // Glitch effect on reset
        this.tweens.add({
            targets: resetButton,
            scaleX: 0.8,
            scaleY: 0.8,
            duration: 100,
            yoyo: true,
            ease: 'Power2'
        });
    });

    resetButton.on('pointerover', () => {
        resetButton.setStyle({ backgroundColor: '#ff8833', fill: '#000000' });
    });

    resetButton.on('pointerout', () => {
        resetButton.setStyle({ backgroundColor: '#ff6600', fill: '#ffffff' });
    });
}

function createGridBackground() {
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, colors.neonCyan, 0.1);
    
    // Draw grid lines
    for (let x = 0; x < 800; x += 40) {
        gridGraphics.moveTo(x, 0);
        gridGraphics.lineTo(x, 600);
    }
    for (let y = 0; y < 600; y += 40) {
        gridGraphics.moveTo(0, y);
        gridGraphics.lineTo(800, y);
    }
    gridGraphics.strokePath();
    
    // Animate grid opacity
    this.tweens.add({
        targets: gridGraphics,
        alpha: 0.3,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
}

function checkWinCondition() {
    const currentSequence = getConnectionSequence();
    const requiredSequence = levels[currentLevel];
    
    if (arraysEqual(currentSequence, requiredSequence)) {
        gameWon = true;
        instructionText.setText(`✨ LEVEL ${currentLevel} SYNTHESIZED ✨`);
        instructionText.setStyle({ fill: '#ffff00', stroke: '#ffff00' });
        
        // Vaporwave celebration effect
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const effects = ['⭐', '✨', '💫', '🔮', '⚡'];
                const effect = effects[Math.floor(Math.random() * effects.length)];
                const star = game.scene.scenes[0].add.text(
                    Phaser.Math.Between(100, 700),
                    Phaser.Math.Between(100, 500),
                    effect,
                    { 
                        fontSize: '24px',
                        fill: `#${Math.floor(Math.random()*16777215).toString(16)}`
                    }
                );
                
                game.scene.scenes[0].tweens.add({
                    targets: star,
                    y: star.y - 150,
                    alpha: 0,
                    rotation: Math.PI * 2,
                    duration: 1500,
                    ease: 'Power2',
                    onComplete: () => star.destroy()
                });
            }, i * 150);
        }
        
        // Advance to next level after a delay
        setTimeout(() => {
            currentLevel++;
            if (levels[currentLevel]) {
                resetLevel();
                instructionText.setText(`🎯 SEQUENCE: ${levels[currentLevel].join(' → ').toUpperCase()}`);
                instructionText.setStyle({ fill: '#00ff80', stroke: '#00ff80' });
                levelText.setText(`🔮 LEVEL ${currentLevel}`);
            } else {
                instructionText.setText('👑 NEURAL MATRIX MASTERED! PROTOCOL COMPLETE! 👑');
                instructionText.setStyle({ fill: '#ff0080', stroke: '#ff0080' });
            }
        }, 3500);
    }
}

function getConnectionSequence() {
    // Build a sequence from connections starting from the first node
    const sequence = [];
    const visited = new Set();
    
    // Find the starting node (one that has no incoming connections)
    const incomingNodes = new Set(connections.map(c => c.to.name));
    const startingNodes = connections.filter(c => !incomingNodes.has(c.from.name));
    
    if (startingNodes.length === 0 && connections.length > 0) {
        // If no clear starting node, start with the first connection
        let current = connections[0].from.name;
        sequence.push(current);
        visited.add(current);
        
        while (true) {
            const nextConnection = connections.find(c => c.from.name === current && !visited.has(c.to.name));
            if (!nextConnection) break;
            current = nextConnection.to.name;
            sequence.push(current);
            visited.add(current);
        }
    } else if (startingNodes.length > 0) {
        let current = startingNodes[0].from.name;
        sequence.push(current);
        visited.add(current);
        
        while (true) {
            const nextConnection = connections.find(c => c.from.name === current && !visited.has(c.to.name));
            if (!nextConnection) break;
            current = nextConnection.to.name;
            sequence.push(current);
            visited.add(current);
        }
    }
    
    return sequence;
}

function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
}

function resetLevel() {
    connections = [];
    selectedNode = null;
    dragLine = null;
    gameWon = false;
    gameStarted = false;
    timer = 300; // Reset timer
}

function update() {
    // Update timer with neon effects
    if (gameStarted && !gameWon && timer > 0) {
        timer -= 1/60; // Assuming 60 FPS
        const minutes = Math.floor(timer / 60);
        const seconds = Math.floor(timer % 60);
        timerText.setText(`⚡ ${minutes}:${seconds.toString().padStart(2, '0')}`);
        
        // Change color as time runs out
        if (timer < 60) {
            timerText.setStyle({ fill: '#ff0080', stroke: '#ff0080' });
        } else if (timer < 120) {
            timerText.setStyle({ fill: '#ff6600', stroke: '#ff6600' });
        }
        
        if (timer <= 0) {
            instructionText.setText('⚠️ TEMPORAL BREACH! PROTOCOL FAILED ⚠️');
            instructionText.setStyle({ fill: '#ff0080', stroke: '#ff0080' });
            resetLevel();
        }
    }

    // Clear and redraw graphics with neon effects
    graphics.clear();
    
    // Draw existing connections with glowing lines
    connections.forEach(connection => {
        // Outer glow
        graphics.lineStyle(8, connection.from.color, 0.3);
        graphics.beginPath();
        graphics.moveTo(connection.from.x, connection.from.y);
        graphics.lineTo(connection.to.x, connection.to.y);
        graphics.strokePath();
        
        // Main line
        graphics.lineStyle(4, 0xffffff, 0.9);
        graphics.beginPath();
        graphics.moveTo(connection.from.x, connection.from.y);
        graphics.lineTo(connection.to.x, connection.to.y);
        graphics.strokePath();
        
        // Inner core
        graphics.lineStyle(2, connection.to.color, 1);
        graphics.beginPath();
        graphics.moveTo(connection.from.x, connection.from.y);
        graphics.lineTo(connection.to.x, connection.to.y);
        graphics.strokePath();
        
        // Draw futuristic arrow
        const angle = Phaser.Math.Angle.Between(connection.from.x, connection.from.y, connection.to.x, connection.to.y);
        const arrowLength = 25;
        const arrowX = connection.to.x - Math.cos(angle) * 35;
        const arrowY = connection.to.y - Math.sin(angle) * 35;
        
        graphics.lineStyle(3, connection.to.color, 1);
        graphics.beginPath();
        graphics.moveTo(arrowX, arrowY);
        graphics.lineTo(arrowX - Math.cos(angle - 0.4) * arrowLength, arrowY - Math.sin(angle - 0.4) * arrowLength);
        graphics.moveTo(arrowX, arrowY);
        graphics.lineTo(arrowX - Math.cos(angle + 0.4) * arrowLength, arrowY - Math.sin(angle + 0.4) * arrowLength);
        graphics.strokePath();
        
        // Arrow tip glow
        graphics.fillStyle(connection.to.color, 0.6);
        graphics.fillCircle(arrowX, arrowY, 4);
    });
    
    // Draw current drag line with neon effect
    if (dragLine) {
        // Outer glow
        graphics.lineStyle(6, colors.neonCyan, 0.4);
        graphics.beginPath();
        graphics.moveTo(dragLine.startX, dragLine.startY);
        graphics.lineTo(dragLine.endX, dragLine.endY);
        graphics.strokePath();
        
        // Main line
        graphics.lineStyle(3, 0xffffff, 0.8);
        graphics.beginPath();
        graphics.moveTo(dragLine.startX, dragLine.startY);
        graphics.lineTo(dragLine.endX, dragLine.endY);
        graphics.strokePath();
        
        // Pulsing end point
        const pulseAlpha = (Math.sin(Date.now() * 0.01) + 1) * 0.5;
        graphics.fillStyle(colors.neonCyan, pulseAlpha);
        graphics.fillCircle(dragLine.endX, dragLine.endY, 8);
    }
}
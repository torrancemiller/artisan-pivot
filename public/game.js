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
let timer = levelSettings[1].time; // Use level-specific timer
let timerText;
let levelText;
let instructionText;
let difficultyText;
let descriptionText;
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

// Define the correct sequence for each level with increasing difficulty
const levels = {
    // Tutorial levels
    1: ['cut', 'carve', 'polish', 'assemble'],
    2: ['cut', 'polish', 'carve', 'assemble'],
    3: ['carve', 'cut', 'assemble', 'polish'],
    
    // Intermediate levels - more complex sequences
    4: ['polish', 'cut', 'carve', 'assemble'],
    5: ['carve', 'polish', 'cut', 'assemble'],
    6: ['assemble', 'cut', 'polish', 'carve'],
    
    // Advanced levels - reverse engineering
    7: ['assemble', 'polish', 'carve', 'cut'],
    8: ['polish', 'assemble', 'cut', 'carve'],
    9: ['carve', 'assemble', 'polish', 'cut'],
    
    // Expert levels - complex workflows
    10: ['cut', 'carve', 'cut', 'polish', 'assemble'],
    11: ['polish', 'carve', 'polish', 'cut', 'assemble'],
    12: ['carve', 'cut', 'polish', 'carve', 'assemble'],
    
    // Master levels - maximum complexity
    13: ['cut', 'polish', 'carve', 'polish', 'cut', 'assemble'],
    14: ['carve', 'cut', 'carve', 'polish', 'cut', 'assemble'],
    15: ['polish', 'carve', 'cut', 'carve', 'polish', 'assemble']
};

// Level difficulty settings
const levelSettings = {
    1: { time: 300, description: "Basic Assembly", difficulty: "TUTORIAL" },
    2: { time: 280, description: "Refined Process", difficulty: "TUTORIAL" },
    3: { time: 260, description: "Alternative Flow", difficulty: "TUTORIAL" },
    4: { time: 240, description: "Polish First", difficulty: "INTERMEDIATE" },
    5: { time: 220, description: "Carve Lead", difficulty: "INTERMEDIATE" },
    6: { time: 200, description: "Reverse Logic", difficulty: "INTERMEDIATE" },
    7: { time: 180, description: "Backwards Build", difficulty: "ADVANCED" },
    8: { time: 160, description: "Mixed Methods", difficulty: "ADVANCED" },
    9: { time: 140, description: "Complex Chain", difficulty: "ADVANCED" },
    10: { time: 120, description: "Double Cut", difficulty: "EXPERT" },
    11: { time: 110, description: "Polish Emphasis", difficulty: "EXPERT" },
    12: { time: 100, description: "Carve Master", difficulty: "EXPERT" },
    13: { time: 90, description: "Multi-Polish", difficulty: "MASTER" },
    14: { time: 80, description: "Precision Work", difficulty: "MASTER" },
    15: { time: 70, description: "Neural Synthesis", difficulty: "MASTER" }
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
    timerText = this.add.text(550, 15, `⚡ ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`, {
        fontSize: '16px',
        fill: '#00ffff',
        fontFamily: 'Orbitron, monospace',
        backgroundColor: '#1a0a2e',
        padding: { x: 12, y: 6 },
        stroke: '#00ffff',
        strokeThickness: 1
    });

    levelText = this.add.text(550, 45, `🔮 LEVEL ${currentLevel}`, {
        fontSize: '14px',
        fill: '#ff0080',
        fontFamily: 'Orbitron, monospace',
        backgroundColor: '#1a0a2e',
        padding: { x: 12, y: 6 },
        stroke: '#ff0080',
        strokeThickness: 1
    });

    difficultyText = this.add.text(550, 75, `💎 ${levelSettings[currentLevel].difficulty}`, {
        fontSize: '12px',
        fill: getDifficultyColor(levelSettings[currentLevel].difficulty),
        fontFamily: 'Orbitron, monospace',
        backgroundColor: '#1a0a2e',
        padding: { x: 10, y: 4 },
        stroke: getDifficultyColor(levelSettings[currentLevel].difficulty),
        strokeThickness: 1
    });

    descriptionText = this.add.text(550, 105, `${levelSettings[currentLevel].description}`, {
        fontSize: '10px',
        fill: '#ffffff',
        fontFamily: 'Rajdhani, sans-serif',
        backgroundColor: '#0a0a0f',
        padding: { x: 8, y: 3 },
        stroke: '#ffffff',
        strokeThickness: 0.5
    });

    instructionText = this.add.text(20, 15, `🎯 SEQUENCE: ${levels[currentLevel].join(' → ').toUpperCase()}`, {
        fontSize: '14px',
        fill: '#00ff80',
        fontFamily: 'Rajdhani, sans-serif',
        backgroundColor: '#0a0a0f',
        padding: { x: 12, y: 6 },
        stroke: '#00ff80',
        strokeThickness: 1
    });

    // Add futuristic reset button
    const resetButton = this.add.text(550, 135, '⟲ RESET', {
        fontSize: '12px',
        fill: '#ffffff',
        fontFamily: 'Orbitron, monospace',
        backgroundColor: '#ff6600',
        padding: { x: 10, y: 4 },
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

function getDifficultyColor(difficulty) {
    switch(difficulty) {
        case 'TUTORIAL': return '#00ff80';
        case 'INTERMEDIATE': return '#ffff00';
        case 'ADVANCED': return '#ff6600';
        case 'EXPERT': return '#ff0080';
        case 'MASTER': return '#8000ff';
        default: return '#ffffff';
    }
}

function checkWinCondition() {
    const currentSequence = getConnectionSequence();
    const requiredSequence = levels[currentLevel];
    
    if (arraysEqual(currentSequence, requiredSequence)) {
        gameWon = true;
        instructionText.setText(`✨ LEVEL ${currentLevel} SYNTHESIZED ✨`);
        instructionText.setStyle({ fill: '#ffff00', stroke: '#ffff00' });
        
        // Enhanced celebration effect based on difficulty
        const celebrationCount = levelSettings[currentLevel].difficulty === 'MASTER' ? 25 : 15;
        for (let i = 0; i < celebrationCount; i++) {
            setTimeout(() => {
                const effects = ['⭐', '✨', '💫', '🔮', '⚡', '💎', '🏆'];
                const effect = effects[Math.floor(Math.random() * effects.length)];
                const star = game.scene.scenes[0].add.text(
                    Phaser.Math.Between(100, 700),
                    Phaser.Math.Between(100, 500),
                    effect,
                    { 
                        fontSize: levelSettings[currentLevel].difficulty === 'MASTER' ? '28px' : '24px',
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
                updateUIForNewLevel();
            } else {
                instructionText.setText('👑 NEURAL MATRIX MASTERED! ALL 15 LEVELS COMPLETE! 👑');
                instructionText.setStyle({ fill: '#ff0080', stroke: '#ff0080' });
                
                // Final celebration
                for (let i = 0; i < 50; i++) {
                    setTimeout(() => {
                        const finalEffect = game.scene.scenes[0].add.text(
                            Phaser.Math.Between(50, 750),
                            Phaser.Math.Between(50, 550),
                            '🏆',
                            { fontSize: '32px', fill: '#ffd700' }
                        );
                        
                        game.scene.scenes[0].tweens.add({
                            targets: finalEffect,
                            y: finalEffect.y - 200,
                            alpha: 0,
                            rotation: Math.PI * 4,
                            duration: 2000,
                            ease: 'Power2',
                            onComplete: () => finalEffect.destroy()
                        });
                    }, i * 100);
                }
            }
        }, 3500);
    }
}

function updateUIForNewLevel() {
    instructionText.setText(`🎯 SEQUENCE: ${levels[currentLevel].join(' → ').toUpperCase()}`);
    instructionText.setStyle({ fill: '#00ff80', stroke: '#00ff80' });
    levelText.setText(`🔮 LEVEL ${currentLevel}`);
    difficultyText.setText(`💎 ${levelSettings[currentLevel].difficulty}`);
    difficultyText.setStyle({ 
        fill: getDifficultyColor(levelSettings[currentLevel].difficulty),
        stroke: getDifficultyColor(levelSettings[currentLevel].difficulty)
    });
    descriptionText.setText(`${levelSettings[currentLevel].description}`);
}

function getConnectionSequence() {
    // For complex sequences where nodes can be used multiple times,
    // we need to trace the actual path through connections
    const sequence = [];
    
    if (connections.length === 0) return sequence;
    
    // Build adjacency map
    const adjacencyMap = new Map();
    const incomingCount = new Map();
    
    // Initialize all nodes
    ['cut', 'carve', 'polish', 'assemble'].forEach(node => {
        adjacencyMap.set(node, []);
        incomingCount.set(node, 0);
    });
    
    // Build the graph
    connections.forEach(conn => {
        adjacencyMap.get(conn.from.name).push(conn.to.name);
        incomingCount.set(conn.to.name, incomingCount.get(conn.to.name) + 1);
    });
    
    // Find starting nodes (nodes with no incoming connections)
    const startingNodes = [];
    for (let [node, count] of incomingCount) {
        if (count === 0 && adjacencyMap.get(node).length > 0) {
            startingNodes.push(node);
        }
    }
    
    // If no clear starting node, find any node that appears in connections
    if (startingNodes.length === 0) {
        const allNodes = [...new Set(connections.flatMap(c => [c.from.name, c.to.name]))];
        if (allNodes.length > 0) {
            startingNodes.push(allNodes[0]);
        }
    }
    
    // Trace the path from starting node
    if (startingNodes.length > 0) {
        const visited = new Set();
        const path = [];
        
        function dfs(node, currentPath) {
            currentPath.push(node);
            
            const neighbors = adjacencyMap.get(node) || [];
            if (neighbors.length === 0) {
                // End of path, check if it's longer than current best
                if (currentPath.length > path.length) {
                    path.splice(0, path.length, ...currentPath);
                }
            } else {
                // Continue to next nodes
                neighbors.forEach(neighbor => {
                    dfs(neighbor, [...currentPath]);
                });
            }
        }
        
        startingNodes.forEach(startNode => {
            dfs(startNode, []);
        });
        
        return path;
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
    timer = levelSettings[currentLevel].time; // Reset timer to current level's time
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
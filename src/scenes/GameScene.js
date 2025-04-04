import Phaser from 'phaser';
import { database } from '../firebase';
import { ref, set, update, remove, onValue, onDisconnect } from 'firebase/database';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');

    // Game variables
    this.player = null;
    this.cursors = null;
    this.gameOver = false;
    this.direction = 'right';
    this.nextDirection = 'right';
    this.moveTime = 0;
    this.moveDelay = 100; // Player movement speed (lower = faster)
    this.gridSize = 16; // Size of each grid cell
    this.otherPlayers = {};
    this.trails = {};
    this.playerTrail = [];
    this.lastUpdateTime = 0;
    this.updateInterval = 100; // Update player position every 100ms
  }

  init(data) {
    // Initialize game data
    this.playerId = data.playerId;
    this.playerName = data.playerName;
    this.playerColor = data.playerColor;

    // Reset game state
    this.gameOver = false;
    this.direction = 'right';
    this.nextDirection = 'right';
    this.playerTrail = [];
    this.otherPlayers = {};
    this.trails = {};
  }

  preload() {
    // Load assets
    this.load.svg('player', 'assets/player.svg');
    this.load.svg('trail', 'assets/trail.svg');
  }

  create() {
    // Create keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create player status text
    this.statusText = this.add.text(16, 16, 'Players: 1', { fontSize: '32px', fill: '#fff' });

    // Create a graphics object for drawing trails
    this.trailGraphics = this.add.graphics();

    // Create a grid for collision detection
    this.grid = {};

    // Create the player
    this.createPlayer();

    // Set up Firebase listeners
    this.setupFirebaseListeners();

    // Register the player in Firebase
    this.registerPlayer();
  }

  update(time) {
    if (this.gameOver) return;

    // Handle keyboard input
    this.handleInput();

    // Move the player
    if (time > this.moveTime) {
      this.moveTime = time + this.moveDelay;
      this.movePlayer();

      // Check for collisions
      this.checkCollisions();
    }

    // Update player position in Firebase periodically
    if (time > this.lastUpdateTime + this.updateInterval) {
      this.lastUpdateTime = time;
      this.updatePlayerData();
    }
  }

  createPlayer() {
    // Create the player at a random position
    const startX = Math.floor(Math.random() * (this.game.config.width / this.gridSize)) * this.gridSize;
    const startY = Math.floor(Math.random() * (this.game.config.height / this.gridSize)) * this.gridSize;

    this.player = this.add.image(startX, startY, 'player');
    this.player.setTint(this.playerColor);

    // Add the initial position to the player's trail
    this.addToTrail(startX, startY);
  }

  addToTrail(x, y) {
    // Add a trail segment at the specified position
    const trail = this.add.image(x, y, 'trail');
    trail.setTint(this.playerColor);

    // Add to player's trail array
    this.playerTrail.push(trail);

    // Mark the grid position as occupied
    const gridKey = `${x},${y}`;
    this.grid[gridKey] = this.playerId;

    return trail;
  }

  setupFirebaseListeners() {
    // Listen for other players
    const playersRef = ref(database, 'players');
    onValue(playersRef, (snapshot) => {
      const players = snapshot.val() || {};

      // Count active players
      const playerCount = Object.keys(players).length;
      this.statusText.setText(`Players: ${playerCount}`);

      // Remove players that are no longer in the database
      for (const id in this.otherPlayers) {
        if (!players[id]) {
          // Remove player and their trail
          if (this.otherPlayers[id].player) {
            this.otherPlayers[id].player.destroy();
          }

          if (this.trails[id]) {
            this.trails[id].forEach(trail => trail.destroy());
            delete this.trails[id];
          }

          delete this.otherPlayers[id];
        }
      }

      // Update or add other players
      for (const id in players) {
        if (id !== this.playerId) {
          this.updateOtherPlayer(id, players[id]);
        }
      }
    });

    // Listen for trail updates
    const trailsRef = ref(database, 'trails');
    onValue(trailsRef, (snapshot) => {
      const trailsData = snapshot.val() || {};

      // Update trails for all players
      for (const id in trailsData) {
        if (id !== this.playerId) {
          this.updateOtherPlayerTrail(id, trailsData[id]);
        }
      }
    });
  }

  updateOtherPlayer(id, playerData) {
    // Create the player if they don't exist
    if (!this.otherPlayers[id]) {
      this.otherPlayers[id] = {
        player: this.add.image(playerData.x, playerData.y, 'player'),
        color: playerData.color
      };
      this.otherPlayers[id].player.setTint(playerData.color);
    } else {
      // Update existing player position
      this.otherPlayers[id].player.x = playerData.x;
      this.otherPlayers[id].player.y = playerData.y;

      // Update player rotation based on direction
      if (playerData.direction) {
        switch (playerData.direction) {
          case 'left':
            this.otherPlayers[id].player.angle = 270;
            break;
          case 'right':
            this.otherPlayers[id].player.angle = 90;
            break;
          case 'up':
            this.otherPlayers[id].player.angle = 0;
            break;
          case 'down':
            this.otherPlayers[id].player.angle = 180;
            break;
        }
      }
    }

    // Initialize trails array if it doesn't exist
    if (!this.trails[id]) {
      this.trails[id] = [];
    }
  }

  updateOtherPlayerTrail(id, trailData) {
    // Initialize trails array if it doesn't exist
    if (!this.trails[id]) {
      this.trails[id] = [];
    }

    // Get the player's color
    const playerColor = this.otherPlayers[id] ? this.otherPlayers[id].color : 0xFFFFFF;

    // Update the grid with trail positions
    for (const point of trailData) {
      const gridKey = `${point.x},${point.y}`;

      // Only add new trail points
      if (!this.grid[gridKey]) {
        // Add to grid
        this.grid[gridKey] = id;

        // Create trail visual
        const trail = this.add.image(point.x, point.y, 'trail');
        trail.setTint(playerColor);

        // Add to trails array
        this.trails[id].push(trail);
      }
    }
  }

  registerPlayer() {
    const playerRef = ref(database, `players/${this.playerId}`);

    // Set the player's initial data
    set(playerRef, {
      name: this.playerName,
      color: this.playerColor,
      x: this.player.x,
      y: this.player.y,
      direction: this.direction
    });

    // Initialize the player's trail in Firebase
    set(ref(database, `trails/${this.playerId}`), [
      { x: this.player.x, y: this.player.y }
    ]);

    // Remove the player when they disconnect
    onDisconnect(playerRef).remove();
    onDisconnect(ref(database, `trails/${this.playerId}`)).remove();
  }

  updatePlayerData() {
    if (!this.gameOver) {
      // Update player position and direction
      update(ref(database, `players/${this.playerId}`), {
        x: this.player.x,
        y: this.player.y,
        direction: this.direction
      });

      // Update player trail
      set(ref(database, `trails/${this.playerId}`),
        this.playerTrail.map(trail => ({
          x: trail.x,
          y: trail.y
        }))
      );
    }
  }

  handleInput() {
    if (this.cursors.left.isDown && this.direction !== 'right') {
      this.nextDirection = 'left';
    } else if (this.cursors.right.isDown && this.direction !== 'left') {
      this.nextDirection = 'right';
    } else if (this.cursors.up.isDown && this.direction !== 'down') {
      this.nextDirection = 'up';
    } else if (this.cursors.down.isDown && this.direction !== 'up') {
      this.nextDirection = 'down';
    }
  }

  movePlayer() {
    // Update the current direction
    this.direction = this.nextDirection;

    // Store the previous position
    const prevX = this.player.x;
    const prevY = this.player.y;

    // Move the player
    switch (this.direction) {
      case 'left':
        this.player.x -= this.gridSize;
        this.player.angle = 270;
        break;
      case 'right':
        this.player.x += this.gridSize;
        this.player.angle = 90;
        break;
      case 'up':
        this.player.y -= this.gridSize;
        this.player.angle = 0;
        break;
      case 'down':
        this.player.y += this.gridSize;
        this.player.angle = 180;
        break;
    }

    // Wrap around the screen
    if (this.player.x < 0) this.player.x = this.game.config.width - this.gridSize;
    if (this.player.x >= this.game.config.width) this.player.x = 0;
    if (this.player.y < 0) this.player.y = this.game.config.height - this.gridSize;
    if (this.player.y >= this.game.config.height) this.player.y = 0;

    // Add a trail at the new position if it's different from the previous position
    if (this.player.x !== prevX || this.player.y !== prevY) {
      this.addToTrail(this.player.x, this.player.y);
    }
  }

  checkCollisions() {
    // Get the current position
    const gridKey = `${this.player.x},${this.player.y}`;

    // Check if the current position is already occupied by a trail
    if (this.grid[gridKey] && this.grid[gridKey] !== this.playerId) {
      // Collision with another player's trail
      this.handleGameOver();
    } else if (this.playerTrail.length > 1) {
      // Check for collision with own trail (excluding the head)
      for (let i = 0; i < this.playerTrail.length - 1; i++) {
        const trail = this.playerTrail[i];
        if (this.player.x === trail.x && this.player.y === trail.y) {
          this.handleGameOver();
          break;
        }
      }
    }
  }

  handleGameOver() {
    this.gameOver = true;

    // Create a custom event for game over
    const gameOverEvent = new CustomEvent('gameOver', {
      detail: { playerId: this.playerId }
    });
    document.dispatchEvent(gameOverEvent);

    // Show game over message
    this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 2,
      'Game Over!',
      { fontSize: '64px', fill: '#fff' }
    ).setOrigin(0.5);

    // Remove the player from Firebase
    remove(ref(database, `players/${this.playerId}`));
    remove(ref(database, `trails/${this.playerId}`));
  }
}

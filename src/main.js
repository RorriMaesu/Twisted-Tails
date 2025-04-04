// Add debugging message to help identify loading issues
console.log('Main.js is loading...');

// Using the global Phaser object from the CDN
// No need to import Phaser
import StartScene from './scenes/StartScene';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';

console.log('Modules imported successfully!');

// Game configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [StartScene, GameScene, GameOverScene]
};

// Initialize the game
console.log('Initializing Phaser game...');
const game = new Phaser.Game(config);
console.log('Phaser game initialized!');

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const playerNameInput = document.getElementById('player-name');
const finalScoreElement = document.getElementById('final-score');

// Initialize the game when the start button is clicked
startButton.addEventListener('click', () => {
  const playerName = playerNameInput.value.trim() || 'Player';
  startScreen.classList.add('hidden');

  // Generate a unique player ID
  const playerId = 'player_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);

  // Generate a random color for the player
  const playerColor = Phaser.Display.Color.RandomRGB().color;

  // Start the game scene
  game.scene.start('GameScene', {
    playerId: playerId,
    playerName: playerName,
    playerColor: playerColor
  });
});

// Restart the game when the restart button is clicked
restartButton.addEventListener('click', () => {
  gameOverScreen.classList.add('hidden');

  // Generate a unique player ID
  const playerId = 'player_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);

  // Generate a random color for the player
  const playerColor = Phaser.Display.Color.RandomRGB().color;

  // Get player name from input field
  const playerName = playerNameInput.value.trim() || 'Player';

  // Restart the game scene
  game.scene.start('GameScene', {
    playerId: playerId,
    playerName: playerName,
    playerColor: playerColor
  });
});

// Listen for game over event from the GameScene
document.addEventListener('gameOver', (event) => {
  // Show the game over screen after a short delay
  setTimeout(() => {
    gameOverScreen.classList.remove('hidden');
  }, 2000);
});

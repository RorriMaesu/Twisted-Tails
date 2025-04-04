import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  preload() {
    // Load assets for the start scene
    this.load.svg('logo', 'assets/logo.svg');
  }

  create() {
    // Add title text
    this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 3,
      'Twisted Tails',
      {
        fontSize: '64px',
        fontFamily: 'Arial',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // Add subtitle text
    this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 3 + 70,
      'Multiplayer Snake Game',
      {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#ffffff'
      }
    ).setOrigin(0.5);

    // Add instructions
    this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 50,
      'Use arrow keys to control your snake\nEat food to grow longer\nAvoid hitting other snakes',
      {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#ffffff',
        align: 'center'
      }
    ).setOrigin(0.5);

    // Add start button
    const startButton = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 150,
      'Start Game',
      {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#4CAF50',
        padding: {
          left: 20,
          right: 20,
          top: 10,
          bottom: 10
        }
      }
    ).setOrigin(0.5).setInteractive();

    // Add hover effect
    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#66BB6A' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#4CAF50' });
    });

    // Add click event
    startButton.on('pointerdown', () => {
      // Get player name from input field (handled in main.js)
      const playerName = document.getElementById('player-name').value.trim() || 'Player';

      // Generate a unique player ID
      const playerId = 'player_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);

      // Generate a random color for the player
      const playerColor = Phaser.Display.Color.RandomRGB().color;

      // Hide the start screen
      document.getElementById('start-screen').classList.add('hidden');

      // Start the game scene
      this.scene.start('GameScene', {
        playerId: playerId,
        playerName: playerName,
        playerColor: playerColor
      });
    });
  }
}

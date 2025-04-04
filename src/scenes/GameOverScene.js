import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }
  
  init(data) {
    this.score = data.score || 0;
  }
  
  create() {
    // Add game over text
    this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 3,
      'Game Over',
      {
        fontSize: '64px',
        fontFamily: 'Arial',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);
    
    // Add score text
    this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'Your Score: ' + this.score,
      {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#ffffff'
      }
    ).setOrigin(0.5);
    
    // Add restart button
    const restartButton = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 100,
      'Play Again',
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
    restartButton.on('pointerover', () => {
      restartButton.setStyle({ backgroundColor: '#66BB6A' });
    });
    
    restartButton.on('pointerout', () => {
      restartButton.setStyle({ backgroundColor: '#4CAF50' });
    });
    
    // Add click event
    restartButton.on('pointerdown', () => {
      // Hide the game over screen
      document.getElementById('game-over-screen').classList.add('hidden');
      
      // Generate a unique player ID
      const playerId = 'player_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
      
      // Generate a random color for the player
      const playerColor = Phaser.Display.Color.RandomRGB().color;
      
      // Get player name from input field
      const playerName = document.getElementById('player-name').value.trim() || 'Player';
      
      // Restart the game scene
      this.scene.start('GameScene', {
        playerId: playerId,
        playerName: playerName,
        playerColor: playerColor
      });
    });
  }
}

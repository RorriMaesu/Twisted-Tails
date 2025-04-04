# Twisted Tails - Multiplayer Trail Game

A real-time multiplayer trail game (similar to Trail Blazer) built with Phaser and Firebase.

## Features

- Real-time multiplayer gameplay
- Players leave colorful trails as they move
- Collision detection with trails
- Last player standing wins
- Responsive design

## Technologies Used

- [Phaser 3](https://phaser.io/) - HTML5 game framework
- [Firebase Realtime Database](https://firebase.google.com/docs/database) - Real-time data synchronization
- [Vite](https://vitejs.dev/) - Frontend build tool

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/twisted-tails.git
   cd twisted-tails
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## How to Play

1. Enter your name and click "Start Game"
2. Use the arrow keys to control your player
3. Your player leaves a permanent trail as it moves
4. Try to trap other players with your trail
5. Avoid colliding with any trails (including your own)
6. Last player standing wins!

## Deployment

To build the game for production:

```
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Phaser](https://phaser.io/) for the game framework
- [Firebase](https://firebase.google.com/) for the real-time database
- All contributors and players!

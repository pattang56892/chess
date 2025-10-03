# Chess vs Stockfish - React Edition

A chess application built with React that allows you to play against the Stockfish chess engine.

## Features

- Play chess against Stockfish AI
- Real-time position analysis
- Move suggestions and hints
- Multiple board themes
- Move history tracking
- Undo moves

## Tech Stack

- **Frontend**: React
- **Chess Logic**: chess.js
- **Board UI**: chessboard.js
- **Backend**: Flask (Python)
- **Chess Engine**: Stockfish

## Installation

### Prerequisites
- Node.js and npm
- Python 3.x
- Stockfish engine (download separately from [official site](https://stockfishchess.org/download/))

### Setup

1. Clone the repository
2. Install frontend dependencies:
   \\\ash
   cd chess-react
   npm install
   \\\

3. Install backend dependencies:
   \\\ash
   pip install flask flask-cors python-chess
   \\\

4. Download Stockfish and place the executable in the project root

5. Start the backend:
   \\\ash
   python web_chess.py
   \\\

6. Start the frontend:
   \\\ash
   cd chess-react
   npm start
   \\\

## Project Structure

- \chess-react/\ - React frontend application
- \web_chess.py\ - Flask backend API
- \play_chess.py\ - Original CLI chess implementation

## Branches

- \main\ - React implementation
- \chess_React_feature01\ - Active React development
- \chess_vanillaJS_feature01\ - Original vanilla JS implementation

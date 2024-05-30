# ChessVerse
ChessVerse is a dynamic and interactive chess application developed by Ahmed, Ayman, and Mohammed. This application allows users to enjoy the classic game of chess with two exciting game modes: playing against a powerful AI (Stockfish) and local play against another person.

## Features
- **Play against AI**: Challenge yourself against the Stockfish AI, one of the strongest chess engines available.
- **Local Play**: Play chess with a friend on the same device.
- **User-friendly Interface**: Intuitive and easy-to-use interface created with React.
- **Robust Backend**: Powerful and efficient backend built with Python.

## Technology Stack
- **Frontend**: React
- **Backend**: Python
- **AI Engine**: Stockfish

## Installation and Setup

### Prerequisites
- Python 3.x
- Node.js
- npm or yarn

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/ChessVerse.git
   cd ChessVerse/server
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. Install the required Python packages:
   ```bash
   pip3 install -r requirements.txt
   ```

4. Ensure the Stockfish binary is included in the backend directory (this is already included in the repo).

5. Start the backend server:
   ```bash
   python chessapp.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../client
   ```

2. Install the required packages:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the frontend server:
   ```bash
   npm start
   # or
   yarn start
   ```

### Running the Application
- Ensure both backend and frontend servers are running.
- Open your web browser and go to `http://localhost:3000`.

## Usage
1. Open the application in your web browser.
2. Choose a game mode: Play against AI or Local Play.
3. Enjoy your game of chess!

## Contributors
- **Ahmed**
- **Ayman**
- **Mohammed**

## License
This project is licensed under the MIT License.

## Acknowledgements
- Thanks to the Stockfish team for their incredible chess engine.

## Contact
For any questions or feedback, please contact us at:
- Ahmed: [ahmed@example.com](mailto:ahmed@example.com)
- Ayman: [ayman@example.com](mailto:ayman@example.com)
- Mohammed: [mohammed@example.com](mailto:mohammed@example.com)

import React from 'react';
import {Link} from 'react-router-dom';
import chess from './assets/chess.png';

const LandingPage = () => {
return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
        <header className="bg-gray-800 py-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold ml-2">ChessVerse</h1>
            </div>
        </header>

        <div className="flex-grow flex items-center justify-center">
            <div className="container mx-auto text-center my-6">
                <h2 className="text-4xl font-bold mb-1">Play Chess Online</h2>
                <p className="text-xl mb-2">Experience the thrill of chess with our web app.</p>
                <div className='h-96 w-auto'>
                    <img src={chess} alt="" className='w-full h-full object-contain'/>
                </div>
                <Link to="/play" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md">Get Started</Link>
            </div>
        </div>

        {/* About Chess Section */}
        <div className="bg-gray-800 py-12">
            <div className="container mx-auto">
                <h3 className="text-2xl font-bold mb-6">About Chess</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="mb-4">Chess is a classic strategy board game that has been played for centuries. It is a game of skill, strategy, and intellect that challenges players to think several moves ahead and anticipate their opponent's moves.</p>
                        <p className="mb-4">The game is played on an 8x8 checkered board, with two players controlling 16 pieces each. The objective is to checkmate the opponent's king, which means placing it in a position where it has no legal move to escape capture.</p>
                    </div>
                    <div>
                        <img src="https://via.placeholder.com/500x300" alt="Chess Board" className="rounded-md" />
                    </div>
                </div>
            </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-800 py-12">
            <div className="container mx-auto">
                <h3 className="text-2xl font-bold mb-6">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-700 p-6 rounded-md">
                        <h4 className="text-xl font-bold mb-2">Online Multiplayer</h4>
                        <p>Play against opponents from around the world.</p>
                    </div>
                    <div className="bg-gray-700 p-6 rounded-md">
                        <h4 className="text-xl font-bold mb-2">AI Opponents</h4>
                        <p>Challenge yourself against advanced AI players.</p>
                    </div>
                    <div className="bg-gray-700 p-6 rounded-md">
                        <h4 className="text-xl font-bold mb-2">Leaderboard</h4>
                        <p>Compete for the top spot on our global leaderboard.</p>
                    </div>
                </div>
            </div>
        </div>

        <footer className="bg-gray-800 py-4">
            <div className="container mx-auto text-center">
                <p>&copy; 2023 ChessVerse. All rights reserved.</p>
            </div>
        </footer>
    </div>
);
};

export default LandingPage;
import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import { CustomSquareStyles } from "react-chessboard/dist/chessboard/types";

export default function DebugBoardUI() {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [connected, setConnected] = useState(false);
    const boardName = "GambitBoard-01";

    const customSquareStyles: CustomSquareStyles = {
        e4: {
            backgroundColor: "rgba(0,255,0,0.5)",
        },
        d5: {
            backgroundColor: "rgba(255,0,0,0.5)",
        },
    };

    const move = (dx: number, dy: number) => {
        setX((prev) => prev + dx);
        setY((prev) => prev + dy);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 space-y-6 overflow-x-hidden overflow-y-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Gambit Debug</h1>
                <div className="flex items-center space-x-4">
                    <span
                        className={`px-3 py-1 rounded text-sm ${
                            connected ? "bg-green-600" : "bg-red-600"
                        }`}
                    >
                        {connected ? `Connected: ${boardName}` : "Disconnected"}
                    </span>
                    <button
                        onClick={() => setConnected(!connected)}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                    >
                        {connected ? "Disconnect" : "Connect"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel */}
                <div className="border border-gray-700 rounded-lg p-4 space-y-6">
                    {/* Electromagnet Controls */}
                    <div>
                        <h2 className="text-xl mb-2">Electromagnets</h2>
                        <div className="inline-block border border-gray-600 rounded-lg p-4">
                            <div className="flex flex-col items-center space-y-2">
                                <button className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">
                                    UP
                                </button>
                                <div className="flex space-x-4">
                                    <button className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">
                                        LEFT
                                    </button>
                                    <button className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">
                                        RIGHT
                                    </button>
                                </div>
                                <button className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">
                                    DOWN
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Movement + Calibration Panel */}
                    <div>
                        <h2 className="text-xl mb-4">Movement & Calibration</h2>
                        <div className="flex flex-col lg:flex-row items-start gap-4 border border-gray-700 rounded-lg p-4">
                            {/* State Display */}
                            <div className="space-y-2 w-full lg:w-1/2">
                                <p>X = {x}</p>
                                <p>Y = {y}</p>
                                <div className="flex items-center space-x-2">
                                    <span>Switch:</span>
                                    <div className="inline-block bg-red-600 px-2 py-1 text-sm rounded">
                                        OFF
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="relative w-64 h-64 mx-auto">
                                {/* Outer Ring */}
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                                    <button
                                        onClick={() => move(0, 10)}
                                        className="bg-gray-700 w-12 h-12 rounded-full"
                                    >
                                        +10 Y
                                    </button>
                                </div>
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                                    <button
                                        onClick={() => move(0, -10)}
                                        className="bg-gray-700 w-12 h-12 rounded-full"
                                    >
                                        -10 Y
                                    </button>
                                </div>
                                <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
                                    <button
                                        onClick={() => move(-10, 0)}
                                        className="bg-gray-700 w-12 h-12 rounded-full"
                                    >
                                        -10 X
                                    </button>
                                </div>
                                <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                                    <button
                                        onClick={() => move(10, 0)}
                                        className="bg-gray-700 w-12 h-12 rounded-full"
                                    >
                                        +10 X
                                    </button>
                                </div>

                                {/* Inner Ring */}
                                <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                                    <button
                                        onClick={() => move(0, 1)}
                                        className="bg-gray-600 w-10 h-10 rounded-full"
                                    >
                                        +1 Y
                                    </button>
                                </div>
                                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                                    <button
                                        onClick={() => move(0, -1)}
                                        className="bg-gray-600 w-10 h-10 rounded-full"
                                    >
                                        -1 Y
                                    </button>
                                </div>
                                <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
                                    <button
                                        onClick={() => move(-1, 0)}
                                        className="bg-gray-600 w-10 h-10 rounded-full"
                                    >
                                        -1 X
                                    </button>
                                </div>
                                <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
                                    <button
                                        onClick={() => move(1, 0)}
                                        className="bg-gray-600 w-10 h-10 rounded-full"
                                    >
                                        +1 X
                                    </button>
                                </div>

                                {/* Home Button */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <button
                                        onClick={() => {
                                            setX(0);
                                            setY(0);
                                        }}
                                        className="bg-green-600 p-3 rounded-full"
                                    >
                                        Home
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="border border-gray-700 rounded-lg p-4 flex flex-col items-center">
                    <h2 className="text-xl mb-2">Detection Matrix</h2>
                    <div>
                        <Chessboard
                            id="DetectionBoard"
                            arePiecesDraggable={false}
                            boardWidth={500}
                            customSquareStyles={customSquareStyles}
                            onSquareClick={(square) => {
                                console.log("Move to:", square);
                            }}
                            position=""
                            customDarkSquareStyle={{
                                backgroundColor: "#333333",
                            }}
                            customLightSquareStyle={{
                                backgroundColor: "#666666",
                            }}
                        />
                    </div>
                    <p className="text-sm text-center">
                        Click a square to move the board to that coordinate
                    </p>
                </div>
            </div>
        </div>
    );
}

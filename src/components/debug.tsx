import { useState, useCallback } from "react";
import { useBluetoothService, FSMState } from "./bluetooth";
import { Chess, SQUARES } from "chess.js";
import { Chessboard } from "react-chessboard";
import { CustomSquareStyles } from "react-chessboard/dist/chessboard/types";

const DebugBoard = () => {
    const [chess, setChess] = useState(new Chess());
    const [lastMove, setLastMove] = useState<string>();
    const [fsmState, setFsmState] = useState<FSMState>(FSMState.Idle);
    const [sensedSquares, setSensedSquares] = useState<CustomSquareStyles>({});
    const [optionSquares, setOptionSquares] = useState<CustomSquareStyles>({});

    const updateSensedSquares = useCallback((magnetState: bigint) => {
        let styles: CustomSquareStyles = {};
        SQUARES.forEach((square, index) => {
            const isActive = (magnetState >> BigInt(index)) & BigInt(1);
            if (isActive) {
                styles[square] = {
                    backgroundColor: "rgba(255, 0, 0, 0.6)",
                };
            }
        });
        setSensedSquares(styles);
    }, []);

    // const { connect, disconnect, isConnected, sendMove } = useBluetoothService({
    const { connect, disconnect, isConnected } = useBluetoothService({
        onFenUpdate: (fen) => setChess(new Chess(fen)),
        onMagnetUpdate: updateSensedSquares,
        onStateUpdate: setFsmState,
        onMoveUpdate: setLastMove,
        sendMove: (move) => {},
    });

    const onPieceDragBegin = useCallback(
        (piece: string, sourceSquare: string) => {
            if (fsmState !== FSMState.Idle) return; // If not web's turn, ignore
            const moves = chess.moves({
                square: sourceSquare,
                verbose: true,
            });
            const possibleMoves = moves.map((m) => m.to);

            const styles: CustomSquareStyles = {};
            possibleMoves.forEach((square) => {
                styles[square] = { backgroundColor: "rgba(0, 255, 0, 0.6)" };
            });
            setOptionSquares(styles);
        },
        [chess, fsmState]
    );

    const onPieceDragEnd = useCallback(() => {
        setOptionSquares({});
    }, []);

    const onPieceDrop = useCallback(
        (sourceSquare: string, targetSquare: string) => {
            const moves = chess.moves({
                square: sourceSquare,
                verbose: true,
            });
            const foundMove = moves.find((m) => m.to === targetSquare);
            // not a valid move
            if (!foundMove) {
                return false;
            }

            // TODO: handle promotion
            const move = chess.move(foundMove);

            if (move === null) return false; // Invalid move

            // sendMove(move.san);
            return true;
        },
        // [chess, sendMove]
        [chess]
    );

    return (
        <div>
            <button onClick={isConnected ? disconnect : connect}>
                {isConnected ? "Disconnect" : "Connect"}
            </button>
            <p>Current FEN: {chess.fen()}</p>
            <p>FSM State: {fsmState}</p>
            <p>Last Move: {lastMove}</p>
            <div style={{ width: "650px" }}>
                <Chessboard
                    position={chess.fen()}
                    customSquareStyles={{
                        ...sensedSquares,
                        ...optionSquares,
                    }}
                    onPieceDragBegin={onPieceDragBegin}
                    onPieceDragEnd={onPieceDragEnd}
                    onPieceDrop={onPieceDrop}
                    arePiecesDraggable={fsmState == FSMState.Idle} // Only allow dragging if it's the web user's turn
                />
            </div>
        </div>
    );
};

export default DebugBoard;

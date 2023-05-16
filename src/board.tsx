import { useState } from "react";
import { Chess, ShortMove, Square } from "chess.js";
import { Chessboard } from "react-chessboard";

const Board = () => {
  const [game, setGame] = useState(new Chess());

  const makeAMove = (move: ShortMove | string) => {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }
  
  const makeRandomMove = () => {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }
  
  const onDrop = (sourceSquare: Square, targetSquare: Square) => {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
  
    // illegal move
    if (move === null) return false;
    setTimeout(makeRandomMove, 200);
    return true;
  }

  return <>
    <p>{game.fen()}</p>
    <Chessboard position={game.fen()} onPieceDrop={onDrop} />;
  </>

}

export default Board;

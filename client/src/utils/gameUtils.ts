import type { GameState } from "../types/game";

export const transformGameState = (
  state: GameState,
  playerId: 'player1' | 'player2' | null,
  width: number,
  height: number
): GameState => {
  if (!playerId) return state;

  if (playerId === 'player2') {
    return {
      ...state,
      ball: {
        ...state.ball,
        x: width - state.ball.x,
        y: height - state.ball.y,
        dx: -state.ball.dx,
        dy: -state.ball.dy
      },
      paddles: {
        player1: {
          ...state.paddles.player2,
          x: width - state.paddles.player2.x - state.paddles.player2.width,
          y: height - state.paddles.player2.y - state.paddles.player2.height
        },
        player2: {
          ...state.paddles.player1,
          x: width - state.paddles.player1.x - state.paddles.player1.width,
          y: height - state.paddles.player1.y - state.paddles.player1.height
        }
      },
      score: {
        player1: state.score.player2,
        player2: state.score.player1
      }
    };
  }

  return state;
};
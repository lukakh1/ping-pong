import { Ball, Paddle } from '../types/game';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config/constants';

export class CollisionService {
  checkWallCollision(ball: Ball): 'left' | 'right' | 'top' | 'bottom' | null {
    if (ball.x <= ball.radius || ball.x >= CANVAS_WIDTH - ball.radius) {
      return ball.x <= ball.radius ? 'left' : 'right';
    }
    
    if (ball.y <= ball.radius) {
      return 'top';
    } else if (ball.y >= CANVAS_HEIGHT - ball.radius) {
      return 'bottom';
    }
    
    return null;
  }

  checkPaddleCollision(ball: Ball, paddle: Paddle, paddleType: 'top' | 'bottom'): boolean {
    if (paddleType === 'bottom') {
      return (
        ball.y + ball.radius >= paddle.y &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width &&
        ball.dy > 0
      );
    } else {
      return (
        ball.y - ball.radius <= paddle.y + paddle.height &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width &&
        ball.dy < 0
      );
    }
  }

  handlePaddleCollision(ball: Ball, paddle: Paddle, paddleType: 'top' | 'bottom'): void {
    ball.dy = -ball.dy;
    
    if (paddleType === 'bottom') {
      ball.y = paddle.y - ball.radius;
    } else {
      ball.y = paddle.y + paddle.height + ball.radius;
    }
    
    const hitPos = (ball.x - paddle.x) / paddle.width;
    ball.dx = (hitPos - 0.5) * 10;
  }

  handleWallCollision(ball: Ball, wallType: 'left' | 'right' | 'top' | 'bottom'): void {
    if (wallType === 'left' || wallType === 'right') {
      ball.dx = -ball.dx;
      ball.x = Math.max(ball.radius, Math.min(CANVAS_WIDTH - ball.radius, ball.x));
    }
  }
}
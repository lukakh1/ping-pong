"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionService = void 0;
const constants_1 = require("../config/constants");
class CollisionService {
    checkWallCollision(ball) {
        if (ball.x <= ball.radius || ball.x >= constants_1.CANVAS_WIDTH - ball.radius) {
            return ball.x <= ball.radius ? 'left' : 'right';
        }
        if (ball.y <= ball.radius) {
            return 'top';
        }
        else if (ball.y >= constants_1.CANVAS_HEIGHT - ball.radius) {
            return 'bottom';
        }
        return null;
    }
    checkPaddleCollision(ball, paddle, paddleType) {
        if (paddleType === 'bottom') {
            return (ball.y + ball.radius >= paddle.y &&
                ball.x >= paddle.x &&
                ball.x <= paddle.x + paddle.width &&
                ball.dy > 0);
        }
        else {
            return (ball.y - ball.radius <= paddle.y + paddle.height &&
                ball.x >= paddle.x &&
                ball.x <= paddle.x + paddle.width &&
                ball.dy < 0);
        }
    }
    handlePaddleCollision(ball, paddle, paddleType) {
        ball.dy = -ball.dy;
        if (paddleType === 'bottom') {
            ball.y = paddle.y - ball.radius;
        }
        else {
            ball.y = paddle.y + paddle.height + ball.radius;
        }
        const hitPos = (ball.x - paddle.x) / paddle.width;
        ball.dx = (hitPos - 0.5) * 10;
    }
    handleWallCollision(ball, wallType) {
        if (wallType === 'left' || wallType === 'right') {
            ball.dx = -ball.dx;
            ball.x = Math.max(ball.radius, Math.min(constants_1.CANVAS_WIDTH - ball.radius, ball.x));
        }
    }
}
exports.CollisionService = CollisionService;

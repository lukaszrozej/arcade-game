// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function(sprite = 'images/char-boy.png') {
  this.sprite = sprite;
  this.lives = 3
  this.score = 0;
  this.state = 'alive';
  this.reset();
}

// Resets the player's position to bottom center
Player.prototype.reset = function() {
  this.row = 5;
  this.col = 2;
}

Player.prototype.update = function(dt) {
  switch (this.state) {
    case 'hit':
      if (this.trunkX < 505 && this.trunkX > -101) {
        this.trunkX += dt * this.trunkV;
      }

      const FINAL_Y = 83 * 5 - 40;
      if (this.headY < FINAL_Y) {
        this.headX += dt * this.headVX;
        this.headY += dt * this.headVY;
        this.headVY += dt * this.headA;
      } else {
        this.state = 'alive';
        this.reset();
      }
      break;
  }  
}

Player.prototype.render = function() {
  switch (this.state) {
    case 'alive':
      const x = 101 * this.col;
      const y = 83 * this.row - 40;
      ctx.drawImage(Resources.get(this.sprite), 0, 0, 101, 171, x, y, 101, 171);
      break;
    case 'hit':
      ctx.drawImage(Resources.get(this.sprite), 202, 0, 101, 171, this.trunkX, this.trunkY, 101, 171);
      ctx.drawImage(Resources.get(this.sprite), 101, 0, 101, 171, this.headX, this.headY, 101, 171);
      break;
  }
}

Player.prototype.handleInput = function(input) {
  if (this.dead) return;
  switch (input) {
    case 'left':
      if (this.col > 0) this.col -= 1;
      break;
    case 'right':
      if (this.col < 4) this.col += 1;
      break;
    case 'up':
      if (this.row > 0) this.row -= 1;
      break;
    case 'down':
      if (this.row < 5) this.row += 1;
      break;
  }
  if (this.row === 0) {
    this.score++;
    this.reset();
  }
}

Player.prototype.checkCollisions = function(enemies) {
  if (this.state !== 'alive') return;

  const collision = enemy =>
    enemy.row === this.row && Math.abs(enemy.x - 101 * this.col) < 60;
  const enemy = enemies.find(collision);

  if (enemy) {
    this.lives--;
    this.state = 'hit';

    // Head:

    // initial position
    this.headX = 101 * this.col;
    this.headY = 83 * this.row - 40;

    // final position
    const FINAL_X = 101 * 2;
    const FINAL_Y = 83 * 5 - 40;

    // time it takes the head to fly to the bottom
    const TIME = 1;

    this.headVX = (FINAL_X - this.headX) / TIME;

    // how high the head will fly above it's initial position
    const HEIGHT = 50;

    // how low the head will land below it's initial position
    const DEPTH = FINAL_Y - this.headY;

    // vertical acceleration and initial velocity formulas
    // from conservation of energy and
    // equation of uniformly accelerated motion

    // vertical initial velocity
    this.headVY = -2 * HEIGHT * (1 + Math.sqrt(1 + DEPTH / HEIGHT)) / TIME;

    // vertical acceleration
    this.headA = this.headVY * this.headVY / (2 * HEIGHT);

    // Trunk:

    // initial position
    this.trunkX = 101 * this.col;
    this.trunkY = 83 * this.row - 40;

    // velocities change according to conservation of momentum and energy
    // assuming trunk weighs 0.25 the enemy
    this.trunkV = 1.6 * enemy.v;
    enemy.v *= 0.6;
  }
}

Player.prototype.loseLife = function() {
  this.lives--;
  this.reset();
}

Object.defineProperty(Player.prototype, 'dead', {
  get() {
    return this.lives === 0;
  }
});
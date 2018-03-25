const characterSprites = [
  {
    main: 'images/char-boy.png',
    head: 'images/char-boy-head.png',
    trunk:  'images/char-boy-trunk.png',
  },
  {
    main: 'images/char-cat-girl.png',
    head: 'images/char-cat-girl-head.png',
    trunk:  'images/char-cat-girl-trunk.png',
  },
  {
    main: 'images/char-horn-girl.png',
    head: 'images/char-horn-girl-head.png',
    trunk:  'images/char-horn-girl-trunk.png',
  },
  {
    main: 'images/char-pink-girl.png',
    head: 'images/char-pink-girl-head.png',
    trunk:  'images/char-pink-girl-trunk.png',
  },
  {
    main: 'images/char-princess-girl.png',
    head: 'images/char-princess-girl-head.png',
    trunk:  'images/char-princess-girl-trunk.png',
  },
];


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function(sprite = 'images/char-boy.png') {
  this.sprite = sprite;
  this.lives = 3
  this.score = 0;
  this.reset();
}

// Resets the player's position to bottom center
Player.prototype.reset = function() {
  this.row = 5;
  this.col = 2;
}

Player.prototype.update = function(dt) {}

Player.prototype.render = function() {
  const x = 101 * this.col;
  const y = 83 * this.row - 40;
  ctx.drawImage(Resources.get(this.sprite), x, y);
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
  const collision = enemy =>
    enemy.row === this.row && Math.abs(enemy.x - 101 * this.col) < 60;
  if (enemies.some(collision)) {
    this.loseLife();
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
// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';

  this.setToRandom();
};

// Set the enmies position and velocity to random values
// Position will be off screen
Enemy.prototype.setToRandom = function() {
  const yPositions = [60, 143, 226];
  //position:
  this.x = -101;
  // Row number from 1 to 3 - one of the 3 stone tracks
  this.row = Math.floor(Math.random() * 3) + 1;
  //velocity:
  this.v = Math.random() * 200 + 100;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += this.v * dt;
  if (this.x > 505 || this.x < -101) {
    this.setToRandom();
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  const y = this.row * 83 - 23;
  ctx.drawImage(Resources.get(this.sprite), this.x, y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function() {
  this.sprite = 'images/char-boy.png';
  this.lives = 3
  this.reset();
}

// Resets the player's position to bottom center
Player.prototype.reset = function() {
  this.row = 5;
  this.col = 2;
}

Player.prototype.update = function(dt) {

}

Player.prototype.render = function() {
  const x = 101 * this.col;
  const y = 83 * this.row - 40;
  ctx.drawImage(Resources.get(this.sprite), x, y);
}

Player.prototype.handleInput = function(input) {
  switch(input) {
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
  if (this.row === 0){
    this.reset();
  }
}

Player.prototype.loseLife = function() {
  this.lives--;
  if (this.lives === 0) {
    this.reset();
  }
}

Object.defineProperty(Player.prototype, 'dead', {
  get() {
    return this.lives === 0;
  }
});

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
allEnemies = [
  new Enemy(),
  new Enemy(),
  new Enemy()
];

player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
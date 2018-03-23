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
  this.y = yPositions[Math.floor(Math.random() * 3)];
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
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function() {

}

Player.prototype.update = function(dt) {

}

Player.prototype.render = function() {

}

Player.prototype.handleInput = function(input) {

}

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
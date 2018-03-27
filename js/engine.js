/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make 
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
  var doc = global.document,
    win = global.window,
    canvas = doc.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    lastTime;

  let level = 0;
  let state = 'choose character';

  let enemies = [];
  let player = new Player();

  let scrollProgress;

  const characterImages = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png',
  ];

  let currentCharacter = 2;

  canvas.width = 505;
  canvas.height = 606;
  doc.body.appendChild(canvas);

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  function main() {
    /* Get our time delta information which is required if your game
     * requires smooth animation. Because everyone's computer processes
     * instructions at different speeds we need a constant value that
     * would be the same for everyone (regardless of how fast their
     * computer is) - hurray time!
     */
    var now = Date.now(),
      dt = (now - lastTime) / 1000.0;

    /* Call our update/render functions, pass along the time delta to
     * our update function since it may be used for smooth animation.
     */
    update(dt);
    render();

    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    win.requestAnimationFrame(main);
  }

  /* This function does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
   */
  function init() {
    // reset();
    addEventListeners();
    lastTime = Date.now();
    main();
  }

  function addEventListeners() {
    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
      if (state === 'game over') {
        reset();
        state = 'choose character';
        enemies = [];
        return;
      }
      if (state === 'choose character') {
        if (e.keyCode === 37) {
          currentCharacter += 4;
        }
        if (e.keyCode === 39) {
          currentCharacter += 1;
        }
        if (e.keyCode === 13) {
          reset();
        }
        currentCharacter %= 5;
        return;
      }

      var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
      };

      player.handleInput(allowedKeys[e.keyCode]);
    });
  }

  /* This function is called by main (our game loop) and itself calls all
   * of the functions which may need to update entity's data. Based on how
   * you implement your collision detection (when two entities occupy the
   * same space, for instance when your character should die), you may find
   * the need to add an additional function call here. For now, we've left
   * it commented out - you may or may not want to implement this
   * functionality this way (you could just implement collision detection
   * on the entities themselves within your app.js file).
   */
  function update(dt) {
    if (state === 'scroll') {
      if (scrollProgress > 83 * 5) {
        scrollProgress = 0;
        state = 'play';
        level++;
        player.row = 5;
        player.unfreeze();
      } else {
        scrollProgress += dt * 83 * 5 / 2;
      }
    }
    // updateEntities(dt);
    enemies.forEach(enemy => {
      enemy.update(dt);
    });
    checkEnemyCollisions(enemies);

    player.update(dt);
    player.checkCollisions(enemies);

    if (player.dead) {
      state = 'game over';
    }
    if (player.finishedLevel) {
      player.finishedLevel = false;
      player.freeze();
      state = 'scroll';
      scrollProgress = 0;
    }
  }

  /* This is called by the update function and loops through all of the
   * objects within your enemies array as defined in app.js and calls
   * their update() methods. It will then call the update function for your
   * player object. These update methods should focus purely on updating
   * the data/properties related to the object. Do your drawing in your
   * render methods.
   */
  function updateEntities(dt) {
    enemies.forEach(function(enemy) {
      enemy.update(dt);
    });
    checkEnemyCollisions(enemies);

    player.update(dt);
    player.checkCollisions(enemies);
  }

  // For each pair of different enemies checks if they collide
  // If one is still ofscreen it is reset to random
  // If both are onscreen they switch their velocities
  function checkEnemyCollisions(enemies) {
    for (let i = 0; i < enemies.length; i++) {
      for (let j = i+1; j < enemies.length; j++) {
        const distance = Math.abs(enemies[i].x - enemies[j].x);
        if (enemies[i].row === enemies[j].row && distance < 95) {
          if (enemies[i].offScreen()) {
            enemies[i].setToRandom();
          } else if (enemies[j].offScreen()) {
            enemies[j].setToRandom();
          } else {
            [enemies[i].v, enemies[j].v] = [enemies[j].v, enemies[i].v];
          }
        }
      }
    }
  }

  /* This function initially draws the "game level", it will then call
   * the renderEntities function. Remember, this function is called every
   * game tick (or loop of the game engine) because that's how games work -
   * they are flipbooks creating the illusion of animation but in reality
   * they are just drawing the entire screen over and over.
   */
  function render() {

    if (state === 'scroll') {
      ctx.translate(0, scrollProgress - 5 * 83);
      renderTerrain(level + 1);
      ctx.translate(0, -scrollProgress + 5 * 83);
    }

    ctx.translate(0, scrollProgress);
    renderTerrain(level);
    renderEntities();
    ctx.translate(0, -scrollProgress);

    renderScorePanel();
    renderBottomPanel();
    if (state === 'game over') {
      renderGameOver();
    }
    if (state === 'choose character') {
      renderCharacterSelection();
    }
  }

  function renderCharacterSelection() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 53, canvas.width, canvas.height - 53);

    ctx.textBaseline = 'top';
    ctx.textAlign = 'center'
    ctx.font = '24px sans-serif';
    ctx.fillStyle = 'white';

    ctx.fillText(`Choose a character`, 253, 200);
    ctx.fillText(`using left and right arrow keys`, 253, 240);

    ctx.drawImage(Resources.get('images/Selector.png'), currentCharacter * 101, 5 * 83 - 40);
    characterImages.forEach((image, index) =>
      ctx.drawImage(Resources.get(image), 0, 0, 101, 171, index * 101, 5 * 83 - 40, 101, 171)
    );
  }

  function renderGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 53, canvas.width, canvas.height - 53);

    ctx.textBaseline = 'top';
    ctx.textAlign = 'center'
    ctx.fillStyle = 'white';

    ctx.font = '64px sans-serif';
    ctx.fillText(`Game Over`, 253, 200);

    ctx.font = '24px sans-serif';
    ctx.fillText(`Press any key to restart the game`, 253, 300);
  }

  function renderTerrain(level) {
    const NUM_COLS = 6;
    const NUM_ROWS = 4;

    const rowImages = levels[level].rowImages;

    let row, col;

    for (col = 0; col < NUM_COLS; col++) {
      ctx.drawImage(Resources.get('images/grass-block.png'), col * 101, 0);
    }

    for (row = 0; row < NUM_ROWS; row++) {
      for (col = 0; col < NUM_COLS; col++) {
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, (row + 1) * 83);
      }
    }

    for (col = 0; col < NUM_COLS; col++) {
      ctx.drawImage(Resources.get('images/grass-block.png'), col * 101, 83 * 5);
    }

  }

  // Displays score panel at the top of the screen
  // and within it: level, score, and lives
  function renderScorePanel() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, 53);
 
    ctx.font = '32px sans-serif';
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'start'
    ctx.fillText(`Level: ${level}`, 4, 8);
    ctx.fillText(`Score: ${player.score}`, 140, 8);
 
    for (let i = 1; i <= player.lives; i++) {
      ctx.drawImage(Resources.get('images/heart-small.png'), canvas.width - 4 - i * 32, 10);
    }
  }

  function renderBottomPanel() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 606 - 53, canvas.width, 53);
  }

  /* This function is called by the render function and is called on each game
   * tick. Its purpose is to then call the render functions you have defined
   * on your enemy and player entities within app.js
   */
  function renderEntities() {
    /* Loop through all of the objects within the enemies array and call
     * the render function you have defined.
     */
    enemies.forEach(function(enemy) {
      enemy.render();
    });

    if (state !== 'choose character') {
      player.render();
    }
  }

  /* This function does nothing but it could have been a good place to
   * handle game reset states - maybe a new game menu or a game over screen
   * those sorts of things. It's only called once by the init() method.
   */
  function reset() {
    level = 0;
    enemies = createEnemiesForLevel(0);
    player = new Player(characterImages[currentCharacter]);
    state = 'play';
  }

  function createEnemiesForLevel(level) {
    const options = levels[level].enemyOptions;
    const numberOfEnemies = levels[level].numberOfEnemies;
    const enemies = [];
    for(let i = 0; i < numberOfEnemies; i++) {
      enemies.push(new Enemy(options));
    }
    return enemies;
  }

  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/bug-right.png',
    'images/bug-left.png',
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png',
    'images/heart-small.png',
    'images/Selector.png',
  ]);
  Resources.onReady(init);

  /* Assign the canvas' context object to the global variable (the window
   * object when run in a browser) so that developers can use it more easily
   * from within their app.js files.
   */
  global.ctx = ctx;
})(this);
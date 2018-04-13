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

  let terrain;

  let bugs, newBugs;

  let items, newItems;

  let rocks, newRocks;

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
    reset();
    addEventListeners();
    lastTime = Date.now();
    main();
  }

  function addEventListeners() {
    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
      switch (state) {
        case 'game over':
        case 'win':
          if (e.keyCode === 13){
            reset();
          }
          break;
        case 'choose character': 
          switch (e.keyCode) {
            case 37:
              currentCharacter += 4;
              break;
            case 39:
              currentCharacter += 1;
              break;
            case 13:
              player.setCharacter(characterImages[currentCharacter]);
              player.say(levels[level].message);
              state = 'play';
              break;
            }
          currentCharacter %= 5;
          break;
        case 'play':
          const directions = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
          };

          const direction = directions[e.keyCode];
          if (direction) {
            player.move({
              direction,
              terrain,
              rocks,
              obstacles: [...items, ...bugs, ...rocks],
            });
          }
          break;
      }
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
        // Scroll finished
        scrollProgress = 0;
        state = 'play';
        level++;
        terrain = copyTerrain(levels[level].terrain);
        player.goToStartingPosition();
        bugs = newBugs;
        items = newItems;
        rocks = newRocks;
        player.say(levels[level].message);
      } else {
        scrollProgress += dt * 83 * 5 / 2;
        newBugs.forEach(bug => bug.update(dt));
        newBugs.forEach(bug => bug.checkTerrain(levels[level].terrain));
        checkBugCollisions(newBugs);
        handleBugRockCollisions(newBugs, newRocks);
      }
    }

    bugs.forEach(bug => bug.update(dt));
    bugs.forEach(bug => bug.checkTerrain(terrain));

    checkBugCollisions(bugs);
    handleBugRockCollisions(bugs, rocks);

    rocks.forEach(rock => rock.update(dt));

    player.update(dt);

    player.collect(items);

    player.handleCollisions(bugs);
    player.handleTerrain(terrain);

    if (player.state === 'dead') {
      state = 'game over';
    }
    if (player.finishedLevel) {
      player.finishedLevel = false;
      if (level === levels.length - 1) {
        state = 'win';
      } else {
        state = 'scroll';
        scrollProgress = 0;
        newBugs = createBugsForLevel(level + 1);
        newItems = createItemsForLevel(level + 1);
        newRocks = createRocksForLevel(level + 1);
      }
    }
  }

  // For each pair of different bugs checks if they collide
  // If one is still ofscreen it is reset to random
  // If both are onscreen they switch their velocities
  function checkBugCollisions(bugs) {
    for (let i = 0; i < bugs.length; i++) {
      for (let j = i+1; j < bugs.length; j++) {
        const distance = Math.abs(bugs[i].x - bugs[j].x);
        if (bugs[i].row === bugs[j].row && distance < 95) {
          if (bugs[i].offScreen()) {
            bugs[i].setToRandom();
          } else if (bugs[j].offScreen()) {
            bugs[j].setToRandom();
          } else {
            [bugs[i].v, bugs[j].v] = [bugs[j].v, bugs[i].v];
          }
        }
      }
    }
  }

  function handleBugRockCollisions(bugs, rocks) {
    for(bug of bugs) {
      for (rock of rocks) {
        const col = this.bug.v > 0
              ? Math.ceil(bug.x / 101)
              : Math.floor(bug.x / 101);
        if (col === rock.col && bug.row === rock.row) {
          bug.v *= -1;
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
      renderTerrain(levels[level + 1].terrain);

      newItems.forEach(item => item.render());

      newBugs.forEach(function(bug) {
        bug.render();
      });

      newRocks.forEach(rock => rock.render());

      ctx.translate(0, -scrollProgress + 5 * 83);
    }

    ctx.translate(0, scrollProgress);
    renderTerrain(terrain);

    [...items, ...bugs, ...rocks].forEach(entity => entity.render());

    if (state !== 'choose character') {
      player.render();
    }
    ctx.translate(0, -scrollProgress);

    renderScorePanel();
    renderBottomPanel();
    if (state === 'game over') {
      renderMessage('Game over');
    }
    if (state === 'win') {
      renderMessage('You win!');
    }
    if (state === 'choose character') {
      renderCharacterSelection();
    }
  }

  function renderMessage(message) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 53, canvas.width, canvas.height - 53);

    ctx.textBaseline = 'top';
    ctx.textAlign = 'center'
    ctx.fillStyle = 'white';

    ctx.font = '64px sans-serif';
    ctx.fillText(message, 253, 200);

    ctx.font = '24px sans-serif';
    ctx.fillText(`Press enter to restart the game`, 253, 300);
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
      ctx.drawImage(Resources.get(image), 0, 0, 101, 171, index * 101, 5 * 83, 101, 171)
    );
  }

  function renderTerrain(terrain) {
    // levels[level].terrain
    terrain
      .forEach((row, i) => {
        row.forEach((img, j) => {
          const path = `images/${img}.png`;
          ctx.drawImage(Resources.get(path), j * 101, i * 83);
        })
      });
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

  /* This function does nothing but it could have been a good place to
   * handle game reset states - maybe a new game menu or a game over screen
   * those sorts of things. It's only called once by the init() method.
   */
  function reset() {
    level = 0;

    terrain = copyTerrain(levels[0].terrain);

    bugs = createBugsForLevel(0);

    items = createItemsForLevel(0);

    rocks = createRocksForLevel(0);

    player.reset();
    state = 'choose character';
  }

  function copyTerrain(terrain) {
    return JSON.parse(JSON.stringify(levels[level].terrain));
  }

  function createBugsForLevel(levelNumber) {
    const level = levels[levelNumber];

    const bugs = [];
    for(let i = 0; i < level.landBugs.number; i++) {
      bugs.push(new Bug('land', level.landBugs.options));
    }
    for(let i = 0; i < level.waterBugs.number; i++) {
      bugs.push(new Bug('water', level.waterBugs.options));
    }
    return bugs;
  }

  function createItemsForLevel(levelNumber) {
    return levels[levelNumber]
      .items
      .map(itemProps => new Item(itemProps));
  }

  function createRocksForLevel(levelNumber) {
    return levels[levelNumber]
      .rocks
      .map(position => new Rock(position));
  }

  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
  Resources.load([
    'images/stone.png',
    'images/water.png',
    'images/grass.png',
    'images/land-bug.png',
    'images/water-bug.png',
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png',
    'images/heart-small.png',
    'images/Selector.png',
    'images/splash.png',
    'images/gem-orange.png',
    'images/gem-green.png',
    'images/gem-blue.png',
    'images/key.png',
    'images/rock.png',
    'images/rock-in-water.png',
  ]);
  Resources.onReady(init);

  /* Assign the canvas' context object to the global variable (the window
   * object when run in a browser) so that developers can use it more easily
   * from within their app.js files.
   */
  global.ctx = ctx;
})(this);
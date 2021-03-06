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

  // Current level index  
  let level = 0;

  // Current state of the game
  // Posible values:
  //  - 'choose character' - whemn the character for the player is chosen
  //  - 'scroll' - when the screen scrolls between levels
  //  - 'play' - when the game is being played
  //  - 'win' - when the game is won
  //  - 'game over' - when the game is over
  let state = 'choose character';

  // Variables for terrain and vairous entities  
  // the variables with 'new' prefix
  // reference terrain and entities for the next level
  let terrain, newTerrain;
  let bugs, newBugs;
  let items, newItems;
  let rocks, newRocks;

  let player = new Player();
  let doppelganger = new Doppelganger();

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
    document.addEventListener('keyup', handleInput);
    lastTime = Date.now();
    main();
  }

  /** Handle keyboard input
   * @param {Object} e - event
   */
  function handleInput(e) {
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
            doppelganger.setCharacter(characterImages[currentCharacter]);

            if (levels[level].doppelganger) {
              doppelganger.startLevel(level);
            }

            player.startLevel(level);

            state = 'play';
            break;
          }
        currentCharacter %= 5;
        break;
      case 'play':
        if (e.keyCode === 82) {
          restartCurrentLevel();
        }

        const directions = {
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down'
        };

        const direction = directions[e.keyCode];
        if (direction) {
          const obstacles = [...items, ...bugs, ...rocks];
          player.move({ direction, terrain, rocks, obstacles, doppelganger, });
          doppelganger.move({ direction, terrain, rocks, obstacles, doppelganger: player, });
        }
        break;
    }
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
      if (scrollProgress >= 83 * 5) {
        // Scroll finished
        scrollProgress = 0;
        state = 'play';
        level++;

        terrain = newTerrain;

        bugs = newBugs;
        items = newItems;
        rocks = newRocks;

        if (levels[level].doppelganger) {
          doppelganger.startLevel(level);
        }

        player.startLevel(level);
        player.save();
      } else {
        // Continue scroll
        scrollProgress += dt * 83 * 5 / 1;
        newBugs.forEach(bug => bug.update(dt));
        newBugs.forEach(bug => bug.checkTerrain(levels[level + 1].terrain));
        checkBugCollisions(newBugs);
        handleBugRockCollisions(newBugs, newRocks);
      }
    }

    bugs.forEach(bug => bug.update(dt));
    bugs.forEach(bug => bug.checkTerrain(terrain));

    checkBugCollisions(bugs);
    handleBugRockCollisions(bugs, rocks);

    rocks.forEach(rock => rock.update(dt));

    doppelganger.update(dt);
    doppelganger.collect(items);
    doppelganger.handleCollisions(bugs);
    doppelganger.handleTerrain(terrain);

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
        newTerrain = getTerrainForLevel(level + 1);
        newBugs = createBugsForLevel(level + 1);
        newItems = createItemsForLevel(level + 1);
        newRocks = createRocksForLevel(level + 1);
        doppelganger.deactivate();
      }
    }
  }


  /** Handles bug collisions
   * @description
   * For each pair of different bugs checks if they collide
   * If one is still ofscreen it is reset to random
   * If both are onscreen they switch their velocities
   * @param {Bug[]} bugs - array of bugs
   */
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

  /** Handle bug collisions with rocks
   * @description
   * If any bug collides with any rock
   * it's velocity is reverses
   * @param {Bug[]} bugs - array of bugs
   * @param {Rock[]} bugs - array of rocks
   */
  function handleBugRockCollisions(bugs, rocks) {
    for(const bug of bugs) {
      for (const rock of rocks) {
        const col = bug.v > 0
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

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, 60);

    if (state === 'scroll') {
      ctx.translate(0, scrollProgress - 5 * 83);
      renderTerrain(newTerrain);

      newItems.forEach(item => item.render());
      newBugs.forEach(bug => bug.render());
      newRocks.forEach(rock => rock.render());

      ctx.translate(0, -scrollProgress + 5 * 83);
    }

    ctx.translate(0, scrollProgress);
    renderTerrain(terrain);

    [...items, ...bugs, ...rocks].forEach(entity => entity.render());

    doppelganger.render();

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

  /** Renders a modal message on the screen
   * @param {string} message - text of the message
   */
  function renderMessage(message) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textBaseline = 'top';
    ctx.textAlign = 'center'
    ctx.fillStyle = 'white';

    ctx.font = '64px sans-serif';
    ctx.fillText(message, 253, 200);

    ctx.font = '24px sans-serif';
    ctx.fillText(`Press enter to restart the game`, 253, 300);
  }

  /** Renders a character selection screen
   */
  function renderCharacterSelection() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

  /** Renders terrain
   * @param {string[][]} terrain - terrain
   */
  function renderTerrain(terrain) {
    terrain
      .forEach((row, i) => {
        row.forEach((img, j) => {
          const path = `images/${img}.png`;
          ctx.drawImage(Resources.get(path), j * 101, i * 83);
        })
      });
  }

  /** Renders score panel with info on
   * score, lives and collected keys
   */
  function renderScorePanel() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, 40);
 
    ctx.font = '32px sans-serif';
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'start'
    // ctx.fillText(`Level: ${level}`, 4, 4);
    ctx.fillText(`Score: ${player.score}`, 4, 0);
 
    for (let i = 1; i <= player.lives; i++) {
      ctx.drawImage(Resources.get('images/heart-small.png'), canvas.width - 4 - i * 32, 4);
    }

    if (player.hasKey) {
      ctx.drawImage(Resources.get('images/key-small.png'), 252 - 16, 6)
    }
  }

  /** Renders bottom panel
   */
  function renderBottomPanel() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 606 - 53, canvas.width, 53);

    ctx.font = '24px sans-serif';
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'start'

    ctx.fillText(`Move: ⬅ ⬆ ➡ ⬇`, 8, canvas.height - 45) ;
    ctx.textAlign = 'end';
    ctx.fillText(`Restart level: R`, canvas.width - 8, canvas.height - 45) ;
  }

  /** Resets the game to the 0 level
   */
  function reset() {
    level = 0;

    terrain = getTerrainForLevel(level);
    bugs = createBugsForLevel(level);
    items = createItemsForLevel(level);
    rocks = createRocksForLevel(level);

    if (levels[level].doppelganger) {
      doppelganger.activate();
    }

    player.reset();
    player.save();

    state = 'choose character';
  }

  /** Restart current level
   */
  function restartCurrentLevel() {
    terrain = getTerrainForLevel(level);
    items = createItemsForLevel(level);
    rocks = createRocksForLevel(level);
    if (levels[level].doppelganger) {
      doppelganger.activate();
    }
    player.restore();
    player.goToStartingPosition();
  }

  /** Get terrain for given level
   * @param {number} levelNumber - index of level
   * @returns - terrain
   *  Row 0 comes from next level if it exists
   */
  function getTerrainForLevel(levelNumber) {
    const currentTerrain = levels[levelNumber].terrain;
    if (levelNumber === levels.length - 1) {
      return Array.from(currentTerrain, row => Array.from(row));
    } else {
      const nextTerrain = levels[levelNumber + 1].terrain;
      return [nextTerrain[nextTerrain.length - 1]].concat(
        Array.from(levels[levelNumber].terrain, row => Array.from(row))
      );
    }
  }

  /** Create bugs for given level
   * @param {number} levelNumber - index of level
   * @returns - array of bugs
   */
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

  /** Create items for given level
   * @param {number} levelNumber - index of level
   * @returns - array of items
   */
  function createItemsForLevel(levelNumber) {
    return levels[levelNumber]
      .items
      .map(itemProps => new Item(itemProps));
  }

  /** Create rocks for given level
   * @param {number} levelNumber - index of level
   * @returns - array of rocks
   */
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
    'images/key-small.png',
    'images/rock.png',
    'images/rock-in-water.png',
    'images/big-splash.png',
    'images/start.png',
    'images/explosion.png',
    'images/tree.png',
    'images/door.png',
  ]);
  Resources.onReady(init);

  /* Assign the canvas' context object to the global variable (the window
   * object when run in a browser) so that developers can use it more easily
   * from within their app.js files.
   */
  global.ctx = ctx;
})(this);
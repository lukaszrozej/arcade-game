class Item {
  constructor(props) {
    Object.assign(this,
                 { name: 'gem-orange', col: 2, row: 0 },
                   props
    );
    this.url = `images/${this.name}.png`;
  }

  render() {
    ctx.drawImage(Resources.get(this.url),
                  0, 0, 101, 171,
                  this.col * 101, this.row * 83, 101, 171);
  }
}

class Rock extends Item {
  constructor(props) {
    props.name = 'rock';
    super(props);

    this.splashAnimation = new Animation({
      sprite: new Sprite({
        url: 'images/big-splash.png',
        spriteOffset: 0,
        center: { x: 50,  y: 90 },
        numberOfFrames: 9,
        period: 1,
        once: true,
      }),
      duration: 1,
    });
  }

  move(position, terrain, obstacles) {
    if (position.col < 0 || position.col > 4
      || position.row < 0 || position.row > 5) return false;

    if (obstacles.find(obstacle =>
      obstacle.row === position.row && obstacle.col === position.col)
    ) return false;

    this.row = position.row;
    this.col = position.col;

    if (terrain[this.row][this.col] === 'water') {
      
      terrain[this.row][this.col] = 'rock-in-water';

      this.splashAnimation.from = { x: this.col * 101, y: this.row * 83 };
      this.splashAnimation.initialize();

      this.row = -1;
      this.col = -1;
    }

    return true;
  }

  update(dt) {
    if (this.splashAnimation.initialized) {
      this.splashAnimation.update(dt);
    }
  }

  render() {
    if (this.splashAnimation.done) return;

    if (this.splashAnimation.initialized) {
      this.splashAnimation.render();
    } else {
      super.render();
    }
  }
}
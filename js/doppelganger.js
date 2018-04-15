class Doppelganger extends Player{
  constructor(sprite = 'images/char-horn-girl.png', startingPosition) {
    super(sprite, { y: 0 });
    this.lives = 100000;
    this.deactivate();
  }

  activate() {
    this.state = 'alive';
    this.goToStartingPosition();
  }

  deactivate() {
    this.state = 'inactive';
    this.body.position = { x: -1000, y: -1000, z: 0, a: 0 };
  }

  move(props) {
    if (this.state === 'inactive') return;

    const changeDirection = {
      'up': 'down',
      'down': 'up',
      'left': 'left',
      'right': 'right',
    };

    props.direction = changeDirection[props.direction];
    super.move(props);
  }

  render() {
    if (this.state === 'inactive') return;

    ctx.save();
    ctx.filter = 'grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)';
    super.render();
    ctx.restore();
  }

  update(dt) {
    if (this.state === 'inactive') return;

    super.update(dt);
  }

  collect(items) {
    if (this.state === 'inactive') return;

    super.collect(items);
  }

  handleCollisions(bugs) {
    if (this.state === 'inactive') return;

    super.handleCollisions(bugs);
  }
    
  handleTerrain(terrain) {
    if (this.state === 'inactive') return;

    super.handleTerrain(terrain);
  }

  say(text) {
  }

}
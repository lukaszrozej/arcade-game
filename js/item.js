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
      // Splash
      this.row = -1;
      this.col = -1;
    }

    return true;
  }
}
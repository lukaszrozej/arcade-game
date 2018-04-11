class Item {
  constructor(name = 'gem-orange', position = { x: 202, y: 0 }) {
    this.name = name;
    this.url = `images/${name}.png`;
    this.position = position;
  }

  render() {
    ctx.drawImage(Resources.get(this.url),
                  0, 0, 101, 171,
                  this.position.x, this.position.y, 101, 171);
  }
}
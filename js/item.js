class Item {
  constructor(props) {
    Object.assign(this,
                 { name: 'gem-orange', position: { x: 202, y: 0, }, },
                   props
    );
    this.url = `images/${this.name}.png`;
  }

  render() {
    ctx.drawImage(Resources.get(this.url),
                  0, 0, 101, 171,
                  this.position.x, this.position.y, 101, 171);
  }
}
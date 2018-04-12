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

  move() {
    
  }
}
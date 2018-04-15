class Doppelganger extends Player{
  constructor(sprite = 'images/char-horn-girl.png', startingPosition) {
    super(sprite, { y: 0 });
  }

  move(props) {
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
    ctx.save();
    ctx.filter = 'grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)';
    super.render();
    ctx.restore();
  }
}
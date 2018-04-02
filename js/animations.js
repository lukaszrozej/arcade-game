class Roll {
  constructor(props) {
    this.object = props.object;
    if (props.from) {
      this.object.position = props.from;
    }
    this.duration = props.duration;
    this.v = {
      x: (props.to.x - this.object.position.x) / this.duration,
      y: (props.to.y - this.object.position.y) / this.duration,
      angle: (props.to.angle - this.object.position.angle) / this.duration,
    }
    this.time = 0;
    this.done = false;
  }

  update(dt) {
    if (this.done) return;

    this.object.position.x += dt * this.v.x;
    this.object.position.y += dt * this.v.y;
    this.object.position.angle += dt * this.v.angle;
    this.time += dt;

    if (this.time >= this.duration) {
      this.done = true;
    }
  }

  render() {
    ctx.save();
    ctx.translate(this.object.position.x + this.object.sprite.center.y, this.object.position.y + this.object.sprite.center.y);
    ctx.rotate(this.object.position.angle);
    ctx.drawImage(Resources.get(this.object.sprite.url),
                  this.object.sprite.offset.x, this.object.sprite.offset.y, 101, 171,
                  -this.object.sprite.center.x, -this.object.sprite.center.y, 101, 171);
      ctx.fillStyle = 'green';
      ctx.fillRect(0, 0, 3, 3);
    ctx.restore();
  }
}
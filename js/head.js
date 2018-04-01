class Head {
  constructor(){
    this.v = {};
    this.center = {x: 50, y: 95};
    this.sprite = 'images/char-horn-girl.png';
  }

  update() {

  }

  render() {

  }

  startRollAnimation(props) {
    if (props.from) {
      this.pos = props.from;
    }
    this.to = props.to;
    this.v.x = (this.to.x - this.pos.x) / props.duration;
    this.v.y = (this.to.y - this.pos.y) / props.duration;
    this.v.angle = (this.to.angle - this.pos.angle) / props.duration;
    this.duration = props.duration;
    this.time = 0;
    this.done = false;
  }

  updateRollAnimation(dt) {
    if (this.done) return;

    this.pos.x += dt * this.v.x;
    this.pos.y += dt * this.v.y;
    this.pos.angle += dt * this.v.angle;
    this.time += dt;

    if (this.time >= this.duration) {
      this.done = true;
    }
  }

  renderRollAnimation() {

// if (!this.done) console.log(this.pos);

    ctx.save();
    ctx.translate(this.pos.x + this.center.x, this.pos.y + this.center.y);
    ctx.rotate(this.pos.angle);
    ctx.drawImage(Resources.get(this.sprite), 101, 0, 101, 171, -this.center.x, -this.center.y, 101, 171);
      ctx.fillStyle = 'green';
      ctx.fillRect(0, 0, 3, 3);
    ctx.restore();
  }

}
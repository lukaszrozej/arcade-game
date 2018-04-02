class Roll {
  constructor(props) {
    this.object = props.object;
    if (props.from) {
      Object.assign(this.object.position, props.from)
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
    ctx.translate(this.object.position.x + this.object.sprite.center.x, this.object.position.y + this.object.sprite.center.y);
    ctx.rotate(this.object.position.angle);
    ctx.drawImage(Resources.get(this.object.sprite.url),
                  this.object.sprite.offset.x, this.object.sprite.offset.y, 101, 171,
                  -this.object.sprite.center.x, -this.object.sprite.center.y, 101, 171);
      ctx.fillStyle = 'green';
      ctx.fillRect(0, 0, 3, 3);
    ctx.restore();
  }
}

class Throw {
  constructor(props) {
    this.object = props.object;
    if (props.from) {
      Object.assign(this.object.position, props.from)
    }
    this.duration = props.duration;

    const depth = props.to.y - this.object.position.y;

    this.v = {
      x: (props.to.x - this.object.position.x) / this.duration,
      y: -2 * props.height * (1 + Math.sqrt(1 + depth / props.height)) / this.duration,
      angle: (props.to.angle - this.object.position.angle) / this.duration,
    }
    this.a = this.v.y * this.v.y / (2 * props.height);
    this.time = 0;
    this.done = false;
  }

  update(dt) {
    if (this.done) return;

    this.object.position.x += dt * this.v.x;
    this.object.position.y += dt * this.v.y;
    this.object.position.angle += dt * this.v.angle;
    this.v.y += dt * this.a;
    this.time += dt;

    if (this.time >= this.duration) {
      this.done = true;
    }
  }

  render() {
    ctx.save();
    ctx.translate(this.object.position.x + this.object.sprite.center.x, this.object.position.y + this.object.sprite.center.y);
    ctx.rotate(this.object.position.angle);
    ctx.drawImage(Resources.get(this.object.sprite.url),
                  this.object.sprite.offset.x, this.object.sprite.offset.y, 101, 171,
                  -this.object.sprite.center.x, -this.object.sprite.center.y, 101, 171);
      ctx.fillStyle = 'green';
      ctx.fillRect(0, 0, 3, 3);
    ctx.restore();
  }
}

class Jump {
  constructor(props) {
    this.object = props.object;
    if (props.from) {
      Object.assign(this.object.position, props.from);
    }
    this.startY = this.object.position.y;
    this.duration = props.duration;
    this.height = props.height;
    this.numberOfJumps = props.numberOfJumps;
    this.v = {
      x: (props.to.x - this.object.position.x) / this.duration,
      y: (props.to.y - this.object.position.y) / this.duration,
    }
    this.time = 0;
    this.done = false;
  }

  update(dt) {
    if (this.done) return;

    this.object.position.x += dt * this.v.x;
    this.time += dt;
    this.object.position.y = this. startY
                          + this.time * this.v.y
                          - this.height *  Math.abs(Math.sin(this.numberOfJumps * Math.PI * this.time / this.duration));

    if (this.time >= this.duration) {
      this.done = true;
console.log(this.object.position);
    }
  }

  render() {
    ctx.save();
    ctx.translate(this.object.position.x + this.object.sprite.center.x, this.object.position.y + this.object.sprite.center.y);
    ctx.rotate(this.object.position.angle);
    ctx.drawImage(Resources.get(this.object.sprite.url),
                  this.object.sprite.offset.x, this.object.sprite.offset.y, 101, 171,
                  -this.object.sprite.center.x, -this.object.sprite.center.y, 101, 171);
      ctx.fillStyle = 'green';
      ctx.fillRect(0, 0, 3, 3);
      ctx.fillStyle = 'red';
      ctx.fillRect(-this.object.sprite.center.x, -this.object.sprite.center.y, 3, 3);
    ctx.restore();
  }

}
class Sprite {
  constructor(url, center, numberOfFrames, period, repeat) {
    this.url = url;
    this.center = center;
    this.numberOfFrames = numberOfFrames;
    this.period = period

    this.position = {
      x: 0,
      y: 0,
      z: 0,
      a: 0,
    };
    this.v = {
      x: 0,
      y: 0,
      z: 0,
      a: 0,
    }
    this.gravity = 0;
  }

  update(dt) {
    this.position.x += dt * this.v.x
    this.position.y += dt * this.v.y
    this.position.z += dt * this.v.z
    this.position.a += dt * this.v.a
    this.v.z += dt * this.gravity;

    // Bounce of the floor
    if (this.position.z < 0 and get(terrain, this.position) !== 'water') {
      this.position.z = 0;
      this.v.z = -this.v.z;
    }

  }

  render(ctx) {

  }
}

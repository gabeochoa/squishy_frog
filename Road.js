
class Road {
  constructor(x, w, type, direction=1) {
    this.position = createVector(x, 0)
    this.w = w;
    this.h = height;
    this.type = type;
    this.direction = direction;
  }

  getCol() {
    switch (this.type) {
      case 'road':
        return [255, 255, 255, 100]
      case 'grass':
        return [0, 150, 0];
      case 'water':
        return [0, 0, 255];
      default:
        return [0, 0, 0];
    }
  }

  draw() {
    push()
    stroke(0)
    fill(...this.getCol())
    rect(this.position.x, 0, this.w, height);
    if (this.type == 'road') {
      fill(255)
      for (var i = 0; i < height; i += 20) {
        rect(this.position.x + (this.w / 2), i, 5, 10);
      }
    }
    pop()
  }
}

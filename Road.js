
class Road {
  constructor(x, w, type) {
    this.x = x;
    this.w = w;
    this.y = 0;
    this.h = height;
    this.type = type;
  }

  getCol() {
    switch (this.type) {
      case 'road':
        return [255, 255, 255, 200]
      case 'grass':
        return [0, 150, 0];
      case 'water':
        return [0, 0, 255];
      default:
        return [0, 0, 0];
    }
  }

  draw() {
    fill(...this.getCol())
    rect(this.x, 0, this.w, height);
    if (this.type == 'road') {
      fill(255)
      for (var i = 0; i < height; i += 20) {
        rect(this.x + (this.w / 2), i, 5, 10);
      }
    }
  }
}
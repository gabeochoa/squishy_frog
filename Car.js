
class Car {
  constructor(x, y, ai=false, ai_dir=true) {
    this.angle = 0
    this.x = x;
    this.y = y;
    this.w = 10;
    this.h = 20;
    this.vy = 0;
    this.ai = ai;
    this.ai_settings = {
      "direction": ai_dir,
      "speed": random(0.5, 1)
    }
  }

  ai_move(){
    return [0, (this.ai_settings['direction']? -1 : 1) * this.ai_settings['speed']]
  }

  draw() {
    push()
    translate(this.x, this.y)
    rotate(this.angle)
    fill(255)
    rect(-this.w/2, -this.h/2, this.w, this.h);
    pop();
  }

  move(dirx, diry, road){
    let x, y;
    if(this.ai){
     [x, y] = this.ai_move();
    }else{
      [x, y] = this.actual_move(dirx, diry, road)
    }
    if (this.y < 0) {
      this.y = height;
    }
    if (this.y > height) {
      this.y = 0;
    }
    if (this.x < this.w && x < 0) {
      x = 0;
    }
    if (this.x + this.w + this.w > width && x > 0) {
      x = 0;
    }
    this.x += x;
    this.y += y;
  }

  actual_move(dirx, diry, road) {
    const DEFAULT_HORIZ = 5;
    const ROTATE_SPD = 2;

    this.angle += dirx * ROTATE_SPD;
    const DEFAULT_VERT = 5;
    let r = 0
    switch (road.type) {
      case 'grass':
        r = 0.25
        break
      case 'water':
        r = 0.01
        break
      default:
        r = 0.75;
        break
    }
    const mspeedy = DEFAULT_VERT * r
    let y = cos(this.angle) * mspeedy * diry;
    let x = sin(this.angle) * mspeedy * abs(diry);
    return [x, y];
  }
}

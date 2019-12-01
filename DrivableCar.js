
class DrivableCar extends Car {
  constructor(x, y) {
    super(x, y, false, false)
  }

  getColor(){
    return [255, 0, 0];
  }

  move(dirx, diry, road){
    this.angle += (dirx * this.maxspeed * PI/180);
    const r = this.getRoadSpeed(road);
    const mspeedy = this.maxspeed * r
    this.velocity.y = cos(this.angle) * mspeedy * diry;
    this.velocity.x = sin(this.angle) * mspeedy * abs(diry);

    if(this.position.x < this.w){
      this.position.x += this.w/4
    }
    if(this.position.x + this.w > width){
      this.position.x -= this.w/4
    }

    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxspeed * this.getRoadSpeed(road));

    if (this.position.y < -this.h) {
      this.position.y = height;
    }
    if (this.position.y > height + this.h) {
      this.position.y = 0;
    }

    this.position.add(this.velocity)
    this.acceleration.mult(0.5);
  }

}

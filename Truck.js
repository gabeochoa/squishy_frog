class Truck extends AICar {

  constructor(x, y){
    super(x, y, true, true);
    this.h *= 2.5
    this.w *= 1.25
    this.maxspeed = 3
  }

  getColor(){
    return [150, 150, 150]
  }

  getCabColor(){
    return [100, 100, 100]
  }

  draw(){
    super.draw()
    push()
    translate(this.position.x, this.position.y)
    rotate(this.velocity.heading() + PI/2)
    fill(...this.getCabColor())
    rect(-this.w/2, -this.h/2, this.w, this.h/4);
    pop();
  }
}

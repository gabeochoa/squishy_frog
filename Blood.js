class Blood {
  constructor(x, y){
    this.pos = createVector(x, y);
    this.fade = 255;
  }
  draw(){
    push()
    noStroke()
    fill(255, 0, 0, this.fade--);
    rect(this.pos.x, this.pos.y, 3.5, 3.5);
    pop()
  }
}

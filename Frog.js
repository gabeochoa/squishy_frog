class Frog {

  SIZE = 7;
  JUMP = 10;
  RESET_JC = 15;

  constructor(){
    this.reset();
  }

  reset (){
      this.position = createVector(
        random(-20, 0),
        random(30, height-30)
      )
      this.w = this.SIZE;
      this.h = this.SIZE;
      this.j_c = random(this.RESET_JC, this.RESET_JC*10);
  }

  move(){
    if(this.j_c < 0){
      let x = this.JUMP

      if (this.position.x + this.w + this.w > width && x > 0) {
        if(random(0, 1) > 0.5) {frogs.push(new Frog())}
        this.reset();
      }
      else{
        this.position.x += x
        this.j_c = this.RESET_JC
      }
    }
    this.j_c--;
    this.x = this.position.x
    this.y = this.position.y
  }

  draw(){
    push()
    stroke(0)
    fill(0, 255, 0);
    rect(this.position.x, this.position.y, this.w, this.h)
    pop()
  }

}

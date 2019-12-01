let c = null;
let frogs = [];

class Blood {
  constructor(x, y){
    this.x = x; this.y = y;
  }
  draw(){
    fill(255, 0, 0);
    rect(this.x, this.y, 3.5, 3.5);
  }
}
let blood = [];
let cars = [];
let roads = [];
let points = 0
const FROG_POINTS = 10;


function setup() {
  angleMode(DEGREES);
  createCanvas(400, 400);
  c = new Car(200, 200);
  setupRoads();
  setupCars();
  setupFrogs();
}

function setupFrogs(){
  for(var i = 0; i<10; i++){
    frogs.push(new Frog());
  }
}
function setupCars(){
  cars.push(new Car(110, height/4, true, true));
  cars.push(new Car(210, 200, true, false));
  cars.push(new Car(290, height, true, true));
}
function setupRoads(){
  roads.push(new Road(0, 50, 'grass'));
  roads.push(new Road(50, 50, 'road'));
  roads.push(new Road(100, 50, 'road'));
  roads.push(new Road(150, 50, 'grass'));
  roads.push(new Road(200, 50, 'road'));
  roads.push(new Road(250, 50, 'road'));
  roads.push(new Road(300, 50, 'grass'));
  roads.push(new Road(350, 50, 'water'));
}

function keyStuff() {
  let x = 0;
  let y = 0;

  if (keyIsDown(LEFT_ARROW)) {
    x = -1
  } else if (keyIsDown(RIGHT_ARROW)) {
    x = 1;
  }
  if (keyIsDown(UP_ARROW)) {
    y = -1;
  }
  return [x, y];
}

function list_col(c, roads, default_val) {
  for (const r of roads) {
    const b = intersection(c, r);
    if (b) {
      return r
    }
  }
  return default_val
}


function drawUI() {
  fill(0)
  rect(0, 0, width, 10 + 3)
  fill(255)
  textSize(12);
  text('Points: ' + points, 10, 10 + 1.5);
}

function draw() {
  const mvmt = keyStuff();
  background(0);
  // Collision
  const onRoad = list_col(c, roads, {type: 'none'});
  const onFrog = list_col(c, frogs, null);

  if(onFrog){
    console.log("You hit a frog")
    points += FROG_POINTS;
    blood.push(new Blood(onFrog.x, onFrog.y))
    onFrog.reset();
    if(random(0,1) > 0.5){
      frogs.push(new Frog())
    }
  }

  for(const car of cars){
    const onFrog = list_col(car, frogs, null);
    if(onFrog){
      blood.push(new Blood(onFrog.x, onFrog.y))
      onFrog.reset();
    }
  }

  // Movement
  c.move(...mvmt, onRoad);

  for (const frog of frogs) {
    frog.move();
  }

  for (const car of cars) {
    car.move();
  }

  // Drawing only
  for (const road of roads) {
    road.draw();
  }

  for (const frog of frogs) {
    frog.draw();
  }

  for (const b of blood) {
    b.draw();
  }

  for (const car of cars) {
    car.draw();
  }

  c.draw();
  drawUI();
}

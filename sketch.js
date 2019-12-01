let c = null;
let cars = [];
let roads = [];

function setup() {
  angleMode(DEGREES);
  createCanvas(400, 400);
  c = new Car(200, 200);
  setupRoads();
  cars.push(new Car(210, 200, true));
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
  } else if (keyIsDown(DOWN_ARROW)) {
    y = 1;
  }
  return [x, y];
}

function road_col(c, roads) {

  for (const r of roads) {
    const b = intersection(c, r);
    if (b) {
      return r
    }
  }

  // DEFAULT VALUE IS ROAD
  return {
    type: 'none'
  };;
}

function draw() {
  const mvmt = keyStuff();
  background(0);
  // Collision
  const onRoad = road_col(c, roads);
  
  // Movement
  c.move(...mvmt, onRoad);
  
  for (const car of cars) {
    car.move();
  }

  // Drawing only
  for (const road of roads) {
    road.draw();
  }

  for (const car of cars) {
    car.draw();
  }

  c.draw();
}

function isUndefined(a){
  return a === undefined
}

/**
 * Helper function to determine whether there is an intersection between the two polygons described
 * by the lists of vertices. Uses the Separating Axis Theorem
 *
 * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @return true if there is any intersection between the 2 polygons, false otherwise
 */
function doPolygonsIntersect (a, b) {
  const rect1 = {
    x: a.position.x,
    y: a.position.y,
    w: a.w,
    h: a.h
  };
  const rect2 = {
    x: b.position.x,
    y: b.position.y,
    w: b.w,
    h: b.h
  };
  const vecs_r1 = []
  const vecs_r2 = []
  for(var i = 0; i<5; i++){
      const c_r1 = getPosition(rect1, i)
      const c_r2 = getPosition(rect2, i)
      vecs_r1.push(createVector(c_r1.x, c_r1.y));
      vecs_r2.push(createVector(c_r2.x, c_r2.y));
  }
  a = vecs_r1
  b = vecs_r2

    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {

        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {

            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (isUndefined(minA) || projected < minA) {
                    minA = projected;
                }
                if (isUndefined(maxA) || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (isUndefined(minB) || projected < minB) {
                    minB = projected;
                }
                if (isUndefined(maxB) || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                // console.log("polygons don't intersect!");
                return false;
            }
        }
    }
    return true;
};

function getPosition(rect, pos){
  /*
    4  --------- 1
       |        |
       |   0    |
       |        |
    3  |--------| 2
  */
  switch(pos){
    case 0:
      return createVector(rect.x + (rect.w/2),
                          rect.y + (rect.h/2));
    case 1:
      return createVector(rect.x+rect.w, rect.y);
    case 2:
      return createVector(rect.x+rect.w, rect.y+rect.h);
    case 3:
      return createVector(rect.x, rect.y+rect.h);
    case 4:
      return createVector(rect.x, rect.y);
  }
}
function getMaxProj(rect, vecs){
  const axis = createVector(1, -1);
  let min_proj = vecs[1].dot(axis)
  let min_dot = 1
  let max_proj = vecs[1].dot(axis)
  let max_dot = 1

  for(var j = 2; j < vecs.length; j++){
    const cur_proj = vecs[j].dot(axis)
    if(min_proj > cur_proj){
      min_dot = j; min_proj = cur_proj
    }
    if(cur_proj > max_proj){
      max_dot = j; max_proj = cur_proj
    }
  }
  return [min_proj, min_dot,
          max_proj, max_dot]
}
function sepAxis(a, b){
  const rect1 = {
    x: a.position.x,
    y: a.position.y,
    w: a.w,
    h: a.h
  };
  const rect2 = {
    x: b.position.x,
    y: b.position.y,
    w: b.w,
    h: b.h
  };
  const vecs_r1 = []
  const vecs_r2 = []
  for(var i = 0; i<5; i++){
      const c_r1 = getPosition(rect1, i)
      const c_r2 = getPosition(rect2, i)
      vecs_r1.push(createVector(c_r1.x, c_r1.y));
      vecs_r2.push(createVector(c_r2.x, c_r2.y));
  }
  const [min_proj_r1, min_dot_r1,
          max_proj_r1, max_dot_r1] = getMaxProj(rect1, vecs_r1)
  const [min_proj_r2, min_dot_r2,
          max_proj_r2, max_dot_r2] = getMaxProj(rect2, vecs_r2)
  return max_proj_r2 < min_proj_r1 || max_proj_r1 < min_proj_r2
}

function intersection(a, b, hitpoint) {
  const rect1 = {
    x: a.position.x,
    y: a.position.y,
    w: a.w,
    h: a.h
  };
  var rect2 = {
    x: b.position.x,
    y: b.position.y,
    w: b.w,
    h: b.h
  };
  if (hitpoint) {
    //divide car into four boxes
    rect2.w /= 2
    rect2.h /= 2
    //hitpoint = [false, false, false, false]
    for (i = 0; i < 4; i++) {
      // LT: 0
      // RT: 1
      // LB: 2
      // RB: 3
      rect2.x = i % 2 ? b.position.x + b.w: b.position.x;
      rect2.y = Math.floor(i / 2)  ? b.position.y + b.h : b.position.y;
      hitpoint[i] = miniInsec(rect1, rect2);
    }
    for (i = 0; i < 4; i++) {
      if (hitpoint[i] == true) {
        return true;
      }
    }
    return false;
  } else {
    return miniInsec(rect1, rect2);
  }
}
function miniInsec(rect1, rect2){
  var x1 = rect2.x,
    y1 = rect2.y,
    x2 = x1 + rect2.w,
    y2 = y1 + rect2.h;

  if (rect1.x > x1) {
    x1 = rect1.x;
  }
  if (rect1.y > y1) {
    y1 = rect1.y;
  }
  if (rect1.x + rect1.w < x2) {
    x2 = rect1.x + rect1.w;
  }
  if (rect1.y + rect1.h < y2) {
    y2 = rect1.y + rect1.h;
  }
  return (x2 <= x1 || y2 <= y1) ? false : true;
}

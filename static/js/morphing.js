let shape1;
let shape2;
let currentShape = [];
let svgCenter;
let t = -2; // Animation time
let scaleFactor = 9.0; 
let duration = 3.0; 
let startTime; 

function preload() {
  shape1 = loadJSON("http://127.0.0.1:5000/static/media/morph_test/first.json");
  shape2 = loadJSON("http://127.0.0.1:5000/static/media/morph_test/second.json");
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-container");

  currentShape = shape1.points;
  svgCenter = calculateSVGCenter(currentShape);
  startTime = millis() / 1000;
}

function draw() {
  background(220);

  let elapsedTime = millis() / 1000 - startTime;
  t = smoothstep(0, 1, elapsedTime / duration);
  t = constrain(t, -2, 1);

  let morphedShape = [];
  let morphedPenState = [];

  if (t < 0) {
    morphedShape = shape1.points;
    morphedPenState = getPenState(shape1.points);
  } else if (t >= 0 && t <= 1) {
    morphedShape = interpolateShapes(shape1.points, shape2.points, t);
    morphedPenState = interpolatePenState(shape1.points, shape2.points, t);
  } else {
    morphedShape = shape2.points;
    morphedPenState = getPenState(shape2.points);
  }

  noFill();
  stroke(0);
  strokeWeight(2);

  let penDown = morphedPenState[0] === 1;
  beginShape();

  for (let i = 0; i < morphedShape.length; i++) {
    let point = morphedShape[i];
    let translatedX = point[0] * scaleFactor + width / 2 - svgCenter.x * scaleFactor;
    let translatedY = point[1] * scaleFactor + height / 2 - svgCenter.y * scaleFactor;
    let penState = morphedPenState[i];

    if (penState === 1) {
      if (!penDown) {
        endShape();
        beginShape();
      }
      penDown = true;
    } else if (penState === 0) {
      if (penDown) {
        endShape();
        beginShape();
      }
      penDown = false;
    }

    vertex(translatedX, translatedY);
  }

  if (penDown) {
    endShape();
  }

  if (t >= 1) {
    noLoop();
  }
}

function calculateSVGCenter(shape) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let point of shape) {
    minX = min(minX, point[0]);
    minY = min(minY, point[1]);
    maxX = max(maxX, point[0]);
    maxY = max(maxY, point[1]);
  }

  let centerX = (minX + maxX) / 2;
  let centerY = (minY + maxY) / 2;
  return { x: centerX, y: centerY };
}

function interpolateShapes(shape1, shape2, t) {
  let interpolatedShape = [];

  for (let i = 0; i < shape1.length; i++) {
    let point1 = shape1[i];
    let point2 = shape2[i];
    let x = lerp(point1[0], point2[0], t);
    let y = lerp(point1[1], point2[1], t);
    interpolatedShape.push([x, y]);
  }

  return interpolatedShape;
}

function interpolatePenState(shape1, shape2, t) {
  let interpolatedPenState = [];

  for (let i = 0; i < shape1.length; i++) {
    let penState1 = shape1[i][2];
    let penState2 = shape2[i][2];
    let penState = Math.round(lerp(penState1, penState2, t));
    interpolatedPenState.push(penState);
  }

  return interpolatedPenState;
}

function getPenState(shape) {
  let penState = [];

  for (let point of shape) {
    penState.push(point[2]);
  }

  return penState;
}

function smoothstep(min, max, t) {
  t = constrain((t - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
}

function keyPressed() {
  if (key === "r") {  // reset
    t = -2;
    startTime = millis() / 1000;
    loop();
  }
}

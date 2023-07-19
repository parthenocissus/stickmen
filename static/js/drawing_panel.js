let currentLine = [];
let rdpLines = [];

let showPoints = true;
let drawingStopped = false;
let currentIndex = 0;
let fileCounter = 2301;

const stickSize = { "w": 17, "h": 35 };
const scaleFactor = 10;

function setup() {
  createCanvas(stickSize.w * scaleFactor,
               stickSize.h * scaleFactor);
  for(let i = 0; i <= 5; i++) {
    rdpLines[i] = [];
  }
}

function draw() {
  background(225);
  noFill();
  stroke(0);
  strokeWeight(2);

  trackLine();

  if (rdpLines[0].length > 2) {

    rdpLines.forEach(rdpPoints => {

      if (rdpPoints.length > 0) {
        beginShape();
        const rdpStart = rdpPoints[0];
        const rdpEnd = rdpPoints[rdpPoints.length - 1];
        curveVertex(rdpStart.x, rdpStart.y);
        rdpPoints.forEach(p => {
          curveVertex(p.x, p.y);
          drawPoint(p.x, p.y);
        });
        curveVertex(rdpEnd.x, rdpEnd.y);
        endShape();
      }

    });

  }

}

function drawPoint(x, y) {
  if (showPoints) {
    strokeWeight(4);
    point(x, y);
    strokeWeight(2);
  }
}

function keyPressed() {
  if (key === "p") {
    showPoints = !showPoints;
  } else if (key === "s") {
    saveData();
  } else if (key === "r") {
    refresh();
  }
}

function trackLine() {
  if ((mouseIsPressed) && (!drawingStopped)) {

    currentLine.push(createVector(mouseX, mouseY));
    let points = currentLine;

    let rdpPoints = [];
    const startP = points[0];
    const endP = points[points.length - 1];
    rdpPoints.push(startP);
    rdp(0, points.length - 1, points, rdpPoints);
    rdpPoints.push(endP);

    rdpLines[currentIndex] = rdpPoints;
  }
}

function mouseReleased() {
  currentIndex++;
  currentLine = [];
  if (currentIndex > 5) {
    drawingStopped = true;
  }
}

function refresh() {
  currentLine = [];
  rdpLines = [];
  showPoints = true;
  drawingStopped = false;
  currentIndex = 0;
  for(let i = 0; i <= 5; i++) {
    rdpLines[i] = [];
  }
}

function saveData() {

  let data = {"points": []};

  rdpLines.forEach(rdpLine => {
    if (rdpLine.length > 0) {
      rdpLine.forEach((p, i, a) => {
        let x = p.x / scaleFactor;
        let y = p.y / scaleFactor;
        let penState = (i === a.length - 1) ? 1 : 0;
        // console.log(x + ", " + y + ", " + penState);
        data.points.push([x, y, penState]);
      });
    }
  });
  data.points[data.points.length - 1][2] = 2;

  // data.points.forEach(p => {
  //   console.log(p[0] + ", " + p[1] + ", " + p[2]);
  // });

  let fileName = fileCounter + '.json';
  saveJSON(data, fileName);
  fileCounter++;
}
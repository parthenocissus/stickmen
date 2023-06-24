// let lines = [];
let showPoints = true;
let scaleFactor = 10;
let viewSize;
let startOfPictos = 200;
let endOfPictos = 299;
let nOfPictos;
let pictograms;
let pictoCounter = 0;
let currentPicto;
let currentIndex = 0;
let startIndex = 0;
let versionCounter = 1;

const localhost = "http://127.0.0.1:5000/static/media/drawings/";

function preload() {
    nOfPictos = endOfPictos - startOfPictos;
    pictoCounter = startOfPictos;
    pictograms = new Array(nOfPictos);

    for (let i = startOfPictos; i <= endOfPictos; i++) {
        loadJSON(localhost + i + ".json", (data) => {
            let lines = [];
            let points = data.points;
            let currentLine = [];
            points.forEach(p => {

                // adjust scale
                let dot = {
                    x: p[0] * scaleFactor,
                    y: p[1] * scaleFactor
                }

                currentLine.push(createVector(dot.x, dot.y));
                if (p[2] !== 0) {
                    const lineCopy = JSON.parse(JSON.stringify(currentLine));
                    lines.push(lineCopy);
                    currentLine = [];
                }
            });
            // pictograms.push(lines);
            // console.log(i - startOfPictos);
            pictograms[i - startOfPictos] = lines;
        });
        // console.log(pictograms);
    }

}

let drawLines = (lines, clr = 0) => {
    stroke(clr);
    lines.forEach(l => {
        beginShape();
        const pStart = l[0];
        const pEnd = l[l.length - 1];
        curveVertex(pStart.x, pStart.y);
        l.forEach(p => {
            curveVertex(p.x, p.y);
            drawPoint(p.x, p.y);
        });
        curveVertex(pEnd.x, pEnd.y);
        endShape();
    });
}

let perlinLines = (lines) => {
    let perlines = [];
    let aOff = 0;
    let lOff = 100;
    lines.forEach(l => {
        perline = [];
        let baseA = random(0, TWO_PI);
        let baseL = random(-15, 15);
        l.forEach(p => {
            let aL = map(noise(aOff), 0, 1, 0, baseA);
            let dL = map(noise(lOff), 0, 1, 0, baseL);
            let pDot = {
                x: p.x + (cos(aL) * baseL),
                y: p.y + (sin(aL) * baseL)
            }
            perline.push(createVector(pDot.x, pDot.y));
            aOff += 0.5;
            lOff += 0.1;
        });
        perlines.push(JSON.parse(JSON.stringify(perline)));
    });
    return perlines;
}

let drawPoint = (x, y) => {
    if (showPoints) {
        strokeWeight(4);
        point(x, y);
        strokeWeight(2);
    }
}

function setup() {
    viewSize = {x: 17 * scaleFactor, y: 35 * scaleFactor};
    createCanvas(viewSize.x, viewSize.y);
    currentPicto = pictograms[startIndex];
    firstPicto = pictograms[startIndex];
}

function draw() {
    background(220);
    noFill();
    stroke(0);
    strokeWeight(2);

    if ((firstPicto !== undefined) && (firstPicto.length > 0)) {
        drawLines(firstPicto, 200);
    }
    if ((currentPicto !== undefined) && (currentPicto.length > 0)) {
        drawLines(currentPicto);
    }

    strokeWeight(1);
    textSize(12);
    text(pictoCounter, 10, 20);
    strokeWeight(2);

    // if (pictoCounter === pictograms.length) {
    //   pictoCounter = 0;
    // }
}

let saveData = (rdpLines) => {

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

    // let currentIndex = pictoCounter + 1;
    let fileName = pictoCounter + 'v' + versionCounter + '.json';
    saveJSON(data, fileName);
    versionCounter++;
}

function keyPressed() {
    if (key === "p") {
        showPoints = !showPoints;
    } else if (key === "s") {
        saveData(currentPicto);
    } else if (key === "t") {
        currentPicto = perlinLines(firstPicto);
    } else if (key === "f") {
        currentPicto = firstPicto;
    } else if (keyCode === RIGHT_ARROW) {
        versionCounter = 1;
        pictoCounter++;
        currentIndex++;
        currentPicto = pictograms[currentIndex];
        firstPicto = pictograms[currentIndex];
    }
}
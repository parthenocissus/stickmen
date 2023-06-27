const startOfPictos = 101;
const endOfPictos = 200;

let nOfPictos;
let showPoints = false;
let pictoScaleFactor = 3;
let scaleFactor = 30;
let size;
let drawings;
let pictograms;

const unit = { x: 17, y: 35 };
const strokeData = { base: 1, bold: 4 };
const margins = { x: 30, y: 30 };

const localhost = "http://127.0.0.1:5000/static/media/drawings/";

function preload() {
    nOfPictos = endOfPictos - startOfPictos + 1;
    pictograms = new Array(nOfPictos);

    for (let i = startOfPictos; i <= endOfPictos; i++) {
        loadJSON(localhost + i + ".json", (data) => {
            let lines = [];
            let points = data.points;
            let currentLine = [];
            points.forEach(p => {

                // adjust scale
                let dot = {
                    x: p[0] * pictoScaleFactor,
                    y: p[1] * pictoScaleFactor
                }

                currentLine.push(createVector(dot.x, dot.y));
                if (p[2] !== 0) {
                    const lineCopy = JSON.parse(JSON.stringify(currentLine));
                    lines.push(lineCopy);
                    currentLine = [];
                }
            });
            pictograms[i - startOfPictos] = lines;
        });

    }

}

let drawLines = (lines, shift, clr = 0) => {
    stroke(clr);
    lines.forEach(l => {
        beginShape();
        const pStart = l[0];
        const pEnd = l[l.length - 1];
        curveVertex(shift.x + pStart.x, shift.y + pStart.y);
        l.forEach(p => {
            let coords = { x: shift.x + p.x, y: shift.y + p.y };
            curveVertex(coords.x, coords.y);
            drawPoint(coords.x, coords.y);
        });
        curveVertex(shift.x + pEnd.x, shift.y + pEnd.y);
        endShape();
    });
}

let drawPoint = (x, y) => {
    if (showPoints) {
        strokeWeight(strokeData.bold);
        point(x, y);
        strokeWeight(strokeData.base);
    }
}

function setup() {
    drawings = shuffle(pictograms);
    viewSize = {x: unit.x * scaleFactor + 2 * margins.x, y: unit.y * scaleFactor + 2 * margins.y};
    createCanvas(viewSize.x, viewSize.y);
}

function draw() {
    background(230);
    noFill();
    stroke(0);
    strokeWeight(strokeData.base);

    // const smallSize = {
    //     w: width / scaleFactor,
    //     h: height / scaleFactor
    // };
    let counter = 0;
    for (let i = 0; i < width - 2 * margins.x; i += unit.x * pictoScaleFactor) {
        for (let j = 0; j < height - 2 * margins.y; j += unit.y  * pictoScaleFactor) {
            let pictogram = drawings[counter++];
            let shift = {x: i + margins.x, y: j + margins.y};
            console.log(i + ", " + j);
            drawLines(pictogram, shift);
        }
    }
}

function keyPressed() {
    if (key === "s") {
        save("test.png");
    }
}
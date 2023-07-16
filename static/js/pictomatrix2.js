const startOfPictos = 1667;
const endOfPictos = 2000;

let nOfPictos;
let showPoints = false;
let pictoScaleFactor = 1.4;
let size;
let drawings;
let pictograms;

const unit = { x: 17, y: 35 };
const gap = 6;
const dim = { w: 33, h: 10 };
const strokeData = { base: 1, bold: 4 };
const margins = { x: 50, y: 50 };
// const pictoMargins = { x: 5, y: 5};

const localhost = "http://127.0.0.1:5000/static/media/drawings/";
// const localhost = "http://127.0.0.1:5000/static/media/drawings-b/";

function preload() {
    unit.x = unit.x + gap;
    unit.y = unit.y + gap;
    nOfPictos = endOfPictos - startOfPictos + 1;
    pictograms = new Array(nOfPictos);

    for (let i = startOfPictos; i <= endOfPictos; i++) {
        loadJSON(localhost + i + ".json", (data) => {
        // loadJSON(localhost + "b" + i + ".json", (data) => {
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
    viewSize = {
        x: (unit.x * pictoScaleFactor * dim.w) + (2 * margins.x),
        y: (unit.y * pictoScaleFactor * dim.h) + (2 * margins.y)
    };
    // createCanvas(viewSize.x, viewSize.y, SVG);
    createCanvas(viewSize.x, viewSize.y);
}

function draw() {
    background(230);
    noFill();
    stroke(0);
    strokeWeight(strokeData.base);

    let counter = 0;

    for (let i = 0; i < dim.w; i++) {
        for (let j = 0; j < dim.h; j++) {
            let pictogram = drawings[counter++];
            let shift = {
                x: (i * unit.x * pictoScaleFactor) + margins.x + gap/2,
                y: (j * unit.y * pictoScaleFactor) + margins.y + gap/2
            };
            drawLines(pictogram, shift);
        }
    }


}

function keyPressed() {
    if (key === "s") {
        // save("pictomatrix.svg");
        save("pictomatrix.png");
    }
}
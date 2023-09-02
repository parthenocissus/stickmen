// Centaur Drawings || 2023.

// #Authors:
//     Uroš Krčadinac | krcadinac.com 
//     Andrej Alfirevic | xladn0.rf.gd 
//     Zeljko Petrovic | instagram@just.blue.dot

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see https://www.gnu.org/licenses.

const startOfPictos = 1;
const endOfPictos = 100;

let nOfPictos;
let showPoints = false;
let pictoScaleFactor = 1.4;  // 1.4;
let size;
let drawings;
let pictograms;

const unit = { x: 17, y: 27.5 };
const gap = 8;
const headR = 5;
const dim = { w: 10, h: 10 };
const strokeData = { base: 1.3, bold: 4 };
const margins = { x: 50, y: 50 };
// const pictoMargins = { x: 5, y: 5};

// const localhost = "http://127.0.0.1:5000/static/media/drawings/";
const localhost = "http://127.0.0.1:5000/static/media/Databases/nn-glyphs/";

function preload() {
    unit.x = unit.x + gap;
    unit.y = unit.y + gap;
    nOfPictos = endOfPictos - startOfPictos + 1;
    pictograms = new Array(nOfPictos);
    // heads = new Array(nOfPictos);

    for (let i = startOfPictos; i <= endOfPictos; i++) {
        // loadJSON(localhost + i + ".json", (data) => {
        loadJSON(localhost + "nn" + i + ".json", (data) => {
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
            pictograms[i - startOfPictos] = {
                "lines": lines,
                // "head": data.head
                // "head": { "x": data.head.x / 10, "y": data.head.y / 10 }
                "head": {
                    "x": data.head.x * pictoScaleFactor,
                    "y": data.head.y * pictoScaleFactor
                }
            };
            // heads[i - startOfPictos] = data.head;
        });

    }

}

let drawHead = (head, shift, clr=0) => {
    fill(clr);
    noStroke();
    circle(shift.x + head.x, shift.y + head.y, headR);
}

let drawLines = (lines, shift, clr=0) => {
    stroke(clr);
    noFill();
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
    // drawings = pictograms;
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
            let index = counter++;
            let pictogram = drawings[index];
            let shift = {
                x: (i * unit.x * pictoScaleFactor) + margins.x + gap/2,
                y: (j * unit.y * pictoScaleFactor) + margins.y + gap/2
            };
            drawLines(pictogram.lines, shift);
            drawHead(pictogram.head, shift);
        }
    }


}

function keyPressed() {
    if (key === "s") {
        // save("pictomatrix.svg");
        save("pictomatrix.png");
    }
}
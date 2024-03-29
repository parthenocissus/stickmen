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


const startOfPictos = 1301;
const endOfPictos = 1400;

let nOfPictos;
let showPoints = false;
let pictoScaleFactor = 3;
let scaleFactor = 30;
let size;
let drawings;s
let pictograms;

const unit = { x: 17, y: 35 };
// const unit = { x: 17, y: 27 };
const strokeData = { base: 2, bold: 4 };
const margins = { x: 50, y: 50 };

const localhost = "http://127.0.0.1:5000/static/media/Databases/drawings/";

function preload() {
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
    viewSize = {x: unit.x * scaleFactor + 2 * margins.x, y: unit.y * scaleFactor + 2 * margins.y};
    createCanvas(viewSize.x, viewSize.y, SVG);
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
            drawLines(pictogram, shift);
        }
    }
}

function keyPressed() {
    if (key === "s") {
        save("pictomatrix.svg");
    }
}
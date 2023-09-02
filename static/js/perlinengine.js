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



// let lines = [];
let startOfPictos = 3400;
let endOfPictos = 4100; 

let showPoints = true;
let scaleFactor = 10;
let viewSize;
let nOfPictos;
let pictograms;
let pictoCounter = 0;
let currentPicto;
let currentIndex = 0;
let startIndex = 0;
let versionCounter = 1;


const localhost = "http://127.0.0.1:5000/static/media/Databases/drawings/";

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
    let aOff = random(0, 100);
    let lOff = random(100, 200);
    lines.forEach((l, i) => {
        perline = [];
        let baseA = random(0, TWO_PI);
        let baseL;
        // let jitterSize = (i !== 0) ? 17 : 7;
        // let baseL = random(-jitterSize, jitterSize);
        if (i === 0) {
            baseL = random(-7, 7);
        } else {
            if (random() > .5) {
                baseL = random(-17, -7);
            } else {
                baseL = random(7, 17);
            }
        }
        l.forEach(p => {
            let aL = map(noise(aOff), 0, 1, 0, baseA);
            let dL = map(noise(lOff), 0, 1, 0, baseL);
            let pDot = {
                x: p.x + (cos(aL) * baseL),
                y: p.y + (sin(aL) * baseL)
            }
            perline.push(createVector(pDot.x, pDot.y));
            aOff += 0.7;
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
    } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
        versionCounter = 1;
        pictoCounter++;
        currentIndex++;
        currentPicto = pictograms[currentIndex];
        firstPicto = pictograms[currentIndex];
    } else if (keyCode === LEFT_ARROW || keyCode === 65) {
        versionCounter = 1;
        pictoCounter--;
        currentIndex--;
        currentPicto = pictograms[currentIndex];
        firstPicto = pictograms[currentIndex];
    }
}
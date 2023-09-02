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


let points;
let lines;
let padding = 20;
let head;

let nPoints;
let bodyLength;
let nLimbs;

let versionCounter = 44;

const scaleFactor = 10;

function setup() {
    // createCanvas(170, 350);
    createCanvas(170, 275);
    frameRate(8);
    refresh();
}

function refresh() {
    points = [];
    lines = [];
    nPoints = int(random(8, 20));
    bodyLength = int(random(3, 10));
    nLimbs = int(random(4, 10));

    generatePoints();
    generateLines();
    lonelyHead();
    cleanPoints();
}

function draw() {
    background(220);

    noFill();
    stroke(0);
    strokeWeight(3);
    lines.forEach(l => {
        // stroke(random(255), random(255), random(255));
        beginShape();
        const first = l[0];
        const last = l[l.length - 1];
        curveVertex(first.x, first.y);
        l.forEach(p => {
            curveVertex(p.x, p.y);
        });
        curveVertex(last.x, last.y);
        endShape();
    })

    noStroke();
    fill(0);
    // points.forEach(p => {
    //     circle(p.x, p.y, 5);
    // });

    stroke(0);
    fill(0);
    circle(head.x, head.y, 18);
}

function generatePoints() {
    let firstPoint = newRandomPoint();
    points.push(firstPoint);
    for (let i = 0; i < nPoints; i++) {
        let nextPoint;
        let maxDistance = 0;
        for (let j = 0; j < 50; j++) {
            let currentPoint = newRandomPoint();
            let nn = nearestNeighbor(currentPoint);
            if (nn.distance > maxDistance) {
                maxDistance = nn.distance;
                nextPoint = currentPoint;
            }
        }
        points.push(nextPoint);
    }
}

function newRandomPoint() {
    return createVector(random(padding, width - padding), random(padding, height - padding));
}

function nearestNeighbor(currentPoint, pointsToExclude = []) {
    let minD = width + height;
    let neighbor;
    let cleanPoints = points.filter(n => !pointsToExclude.includes(n));
    cleanPoints.forEach(p => {
        const d = currentPoint.dist(p);
        if ((d < minD) && (d > 0)) {
            minD = d;
            neighbor = p;
        }
    });
    return {
        distance: minD,
        point: neighbor
    };
}

function generateLines() {
    for (let i = 0; i < nLimbs; i++) {
        let newLine = [];
        let currentPoint = randomPointNotInLines();
        if (currentPoint === undefined) {
            continue;
        } else if (i === 0) {
            head = currentPoint;
        }
        newLine.push(currentPoint);
        for (let j = 0; j < bodyLength; j++) {
            let toExclude = newLine;
            let nn = nearestNeighbor(currentPoint, toExclude);
            newLine.push(nn.point);
            if (pointInLines(nn.point)) {
                break;
            } else {
                currentPoint = nn.point;
            }
        }
        lines.push(newLine);
    }
}

function pointInLines(currentPoint) {
    let result = false;
    lines.forEach(l => {
        l.forEach(p => {
            if (currentPoint && p && currentPoint.dist(p) === 0) {
                result = true;
            }
        });
    });
    return result;
}

function existsInList(currentPoint, list) {
    let result = false;
    list.forEach(p => {
        if (currentPoint.dist(p) === 0) {
            result = true;
        }
    });
    return result;
}

function randomPointNotInLines() {
    for (let i = 0; i < 1000; i++) {
        let randomPoint = random(points);
        const used = pointInLines(randomPoint);
        if (!used) {
            return randomPoint;
        }
    }
}

function lonelyPoints() {
    let lonelies = [];
    points.forEach(p => {
        if (!pointInLines(p)) {
            lonelies.push(p);
        }
    });
    return lonelies;
}

function lonelyHead() {
    let lones = lonelyPoints();
    console.log(lones);
    if ((random() > .3) && (lones.length > 0)) {
        let randomLonely = random(lones);
        console.log(randomLonely);
        console.log("lonely...");
        head = randomLonely;
    }
}

function keyPressed() {
    if (key === "p") {
        // showPoints = !showPoints;
    } else if (key === "s") {
        saveData();
    } else if (keyCode === RIGHT_ARROW) {
        refresh();
    }
}

function cleanPoints() {
    points.filter(item => !!item);
    const filterUndefinedAndNull = (list) => list.filter((element) => element !== undefined && element !== null);
    for (let i = 0; i < lines.length; i++) {
        lines[i] = filterUndefinedAndNull(lines[i]);
    }
}

function saveData() {

    let data = {
        "points": [],
        "head": {
            "x": head.x / scaleFactor,
            "y": head.y / scaleFactor
        }
    };

    lines.forEach(line => {
        if (line.length > 0) {
            line.forEach((p, i, a) => {
                let x = p.x / scaleFactor;
                let y = p.y / scaleFactor;
                let penState = (i === a.length - 1) ? 1 : 0;
                data.points.push([x, y, penState]);
            });
        }
    });
    data.points[data.points.length - 1][2] = 2;

    versionCounter++;
    let fileName = 'nn' + versionCounter + '.json';
    saveJSON(data, fileName);
}
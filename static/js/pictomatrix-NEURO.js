const startOfPictos = 1;
const endOfPictos = 100;

let nOfPictos;
let showPoints = false;
let pictoScaleFactor = 3;
let scaleFactor = 40;
let size;
let drawings;
let pictograms;

const unit = { x: 17, y: 35 }; //x: 17, y: 35
const gap = 12; // bacgkround gap
const dim = { w: 40, h: 27 }; //w: 40, h: 27
// const strokeData = { base: 1, bold: 4 };
const margins = { x: 50, y: 50 };
const spacing = 2; // real gap

const localhost = "http://127.0.0.1:5000/static/media/GlyphsTest/";

function preload() {
    unit.x = unit.x + gap;
    unit.y = unit.y + gap;
    nOfPictos = endOfPictos - startOfPictos + 1;
    pictograms = new Array(nOfPictos);

    for (let i = startOfPictos; i <= endOfPictos; i++) {
        var svgUrl = localhost + i + ".svg";
        pictograms[i - startOfPictos] = loadImage(svgUrl);
    }
}

function setup() {
    drawings = shuffle(pictograms);
    viewSize = {
        x: (unit.x * pictoScaleFactor * dim.w) + (2 * margins.x),
        y: (unit.y * pictoScaleFactor * dim.h) + (2 * margins.y)
    };
    path = querySVG('path')
    createCanvas(viewSize.x, viewSize.y, SVG);
}


function draw() {
    background(230);
    const availableWidth = width - 2 * margins.x;
    const numColumns = Math.floor(availableWidth / (unit.x * pictoScaleFactor + spacing));
    const cellWidth = (availableWidth - (numColumns - 1) * spacing) / numColumns;
    const cellHeight = (unit.y * pictoScaleFactor) + spacing;
    
    let counter = 0;
    for (let j = margins.y; j < height - margins.y; j += cellHeight) {
        for (let i = margins.x; i < width - margins.x; i += cellWidth + spacing) {
            if (counter >= drawings.length) {
                break;
            }
            
            let img = drawings[counter++];
            let shift = {x: i, y: j};
            image(img, shift.x, shift.y, cellWidth, unit.y * pictoScaleFactor);
            // path.attribute('stroke-width', 2);
        }
    }
}

function keyPressed() {
    if (key === "s") {
        save("pictomatrix.svg");
    }
    if (key === "r") {
        location.reload();
    }
}

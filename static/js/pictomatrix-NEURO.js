const startOfPictos = 0;
const endOfPictos = 20;

let nOfPictos;
let showPoints = false;
let pictoScaleFactor = 3;
let scaleFactor = 30;
let size;
let drawings;
let pictograms;

const unit = { x: 35, y: 50 };
// const unit = { x: 17, y: 27 };
const strokeData = { base: 2, bold: 2 };
const margins = { x: 50, y: 20 };
const spacing = 2;

const localhost = "http://127.0.0.1:5000/static/media/rnntestOut/";

function preload() {
    nOfPictos = endOfPictos - startOfPictos + 1;
    pictograms = new Array(nOfPictos);

    for (let i = startOfPictos; i <= endOfPictos; i++) {
        const svgUrl = localhost + i + ".svg";
        pictograms[i - startOfPictos] = loadImage(svgUrl);
    }
}

function setup() {
    drawings = shuffle(pictograms);
    viewSize = {x: unit.x * scaleFactor + 2 * margins.x, y: unit.y * scaleFactor + 2 * margins.y};
    // createCanvas(viewSize.x, viewSize.y, SVG);
    createCanvas(viewSize.x/2, viewSize.y/2, SVG)
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

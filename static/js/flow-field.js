let arrowHeadLength = 3;

var inc = 0.1;
var incStart = 0.01;
var magInc = 0.02;
var start = 0;
var scl = 20;
var cols, rows;
var zoff = 0;
var fps;
var particles = [];
var numParticles = 1000;
var flowfield;
var flowcolorfield;
var magOff = 0;
var showField = true;

function setup() {
    frameRate(30);
    createCanvas(1280, 720);
    // createCanvas(700, 400);
    // createCanvas(300, 200);

    colorMode(HSL, 100);
    pixelDensity(1);
    cols = floor(width / scl);
    rows = floor(height / scl);
    background(0);

    for (let i = 0; i < numParticles; i++) {
        particles[i] = new Particle();
    }

    flowfield = new Array(rows * cols);
    // flowcolorfield = new Array(rows * cols);

    // GIF
    // createLoop({duration: 60, gif: true});
}

function Particle() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;

    this.prevPos = this.pos.copy();

    this.update = function () {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    };

    this.applyForce = function (force) {
        this.acc.add(force);
    };

    this.show = function (colorfield) {
        // strokeWeight(1);
        // line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        this.updatePrev();
        //point(this.pos.x, this.pos.y);
    };

    this.inverseConstrain = function (pos, key, f, t) {
        if (pos[key] < f) {
            pos[key] = t;
            this.updatePrev();
        }
        if (pos[key] > t) {
            pos[key] = f;
            this.updatePrev();
        }
    };

    this.updatePrev = function () {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
    };

    this.edges = function () {
        this.inverseConstrain(this.pos, "x", 0, width);
        this.inverseConstrain(this.pos, "y", 0, height);
    };

    // this.follow = function(vectors, colorfield) {
    this.follow = function (vectors) {
        let x = floor(this.pos.x / scl);
        let y = floor(this.pos.y / scl);
        let index = x + y * cols;
        let force = vectors[index];
        this.applyForce(force);
        // let c = colorfield[index];
        // if (c) {
        //   stroke(color(c[0], c[1], c[2]));
        // }
    };
}

function draw() {
    background(0);

    var yoff = 0;

    for (let y = 1; y < rows; y++) {
        let xoff = start;

        for (let x = 1; x < cols; x++) {
            let index = x + y * cols;
            // let r = map(noise(xoff + 300, yoff + 300, zoff), 0, 1, 100, 255);
            // let g = map(noise(xoff + 100, yoff + 100, zoff), 0, 1, 0, 255);
            // let b = map(noise(xoff + 200, yoff + 200, zoff), 0, 1, 0, 100);

            let h = map(noise(xoff, yoff, zoff), 0, 1, 0, 25);
            // let h = 11.94;
            let s = map(noise(xoff + 100, yoff + 100, zoff), 0, 1, 40, 100);
            let l = map(noise(xoff + 200, yoff + 200, zoff), 0, 1, 30, 70);

            let angle = noise(xoff, yoff, zoff) * TWO_PI;
            let v = p5.Vector.fromAngle(angle); // vector from angle
            let m = map(noise(xoff, yoff, magOff), 0, 1, -2, 2);
            v.setMag(m);

            push();
            // stroke(r, g, b);
            stroke(h, s, l);
            strokeWeight(2);
            translate(x * scl, y * scl);
            rotate(v.heading());
            let endpoint = abs(m) * scl * 0.8;

            if (endpoint < arrowHeadLength) {
                line(0, 0, endpoint, 0);
            } else {
                drawArrow(0, 0, endpoint, 0);
            }


            pop();

            flowfield[index] = v;
            xoff += inc;
        }
        yoff += inc;
    }
    magOff += magInc;
    zoff += incStart;

    save();
    if (frameCount > 300) {
        noLoop();
    }
}

let drawArrow = (dx1, dy1, dx2, dy2, defaultAngle = PI / 4) => {

    let c, a, beta, theta, phi;
    let x1 = dx1,
        x2 = dx2,
        y1 = dy1,
        y2 = dy2;

    let angle = defaultAngle,
        len = arrowHeadLength;

    let ax1, ax2, ay1, ay2;

    c = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    if (Math.abs(x2 - x1) < 1e-6)
        if (y2 < y1) theta = Math.PI / 2;
        else theta = -Math.PI / 2;
    else {
        if (x2 > x1) theta = Math.atan((y1 - y2) / (x2 - x1));
        else theta = Math.atan((y1 - y2) / (x1 - x2));
    }
    a = Math.sqrt(len * len + c * c - 2 * len * c * Math.cos(angle));
    beta = Math.asin((len * Math.sin(angle)) / a);

    phi = theta - beta;
    ay1 = y1 - a * Math.sin(phi);
    if (x2 > x1) ax1 = x1 + a * Math.cos(phi);
    else ax1 = x1 - a * Math.cos(phi);

    phi = theta + beta;
    ay2 = y1 - a * Math.sin(phi);
    if (x2 > x1) ax2 = x1 + a * Math.cos(phi);
    else ax2 = x1 - a * Math.cos(phi);

    line(dx1, dy1, dx2, dy2);
    line(dx2, dy2, ax1, ay1);
    line(dx2, dy2, ax2, ay2);

};

function mousePressed() {
    save("arrows_test.svg");
}

let ants = [];
let foods = [];
let poisons = [];

function setup() {
    createCanvas(640, 480);
    for (let i = 0; i < 50; i++) {
        ants.push(new Ant(random(width), random(height)));
    }

    for (let i = 0; i < 50; i++) {
        foods.push(createVector(random(width), random(height)));
    }
    for (let i = 0; i < 10; i++) {
        poisons.push(createVector(random(width), random(height)));
    }
}

function draw() {
    background(55);

    if (random(1) < 0.1) {
        foods.push(createVector(random(width), random(height)));
    }
    if (random(1) < 0.01) {
        poisons.push(createVector(random(width), random(height)));
    }

    for (let i = ants.length - 1; i >= 0; i--) {
        ants[i].behaviors(foods, poisons);
        ants[i].update();
        ants[i].boundaries();
        ants[i].show();
        let newAnt = ants[i].cloneMe();
        if (newAnt) {
            ants.push(newAnt);
        }

        if (ants[i].dead()) {
            foods.push(createVector(ants[i].pos.x, ants[i].pos.y));
            ants.splice(i, 1);
        }
    }

    for (let i = foods.length - 1; i >= 0; i--) {
        fill(0, 255, 0);
        noStroke();
        ellipse(foods[i].x, foods[i].y, 4);
    }

    for (let i = poisons.length - 1; i >= 0; i--) {
        fill(255, 0, 0);
        noStroke();
        ellipse(poisons[i].x, poisons[i].y, 4);
    }
}

function mouseDragged() {
    ants.push(new Ant(mouseX, mouseY));
}

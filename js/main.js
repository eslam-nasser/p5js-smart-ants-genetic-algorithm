let ants = [];
let foods = [];
let poisons = [];
let foodSlider, posionSlider;
let whenTheWorldCreated, currentTime, timeDiff;

function setup() {
    createCanvas(640, 480);
    createP('Food Generating Rate');
    foodSlider = createSlider(0, 1, 0.1, 0.2);
    createP('Poison Generating Rate');
    posionSlider = createSlider(0, 1, 0.1, 0.1);
    whenTheWorldCreated = new Date();

    // Generate Ants
    for (let i = 0; i < 50; i++) {
        ants.push(new Ant(random(width), random(height)));
    }
    // Generate Food
    for (let i = 0; i < 50; i++) {
        foods.push(createVector(random(width), random(height)));
    }
    // Generate Poison
    for (let i = 0; i < 10; i++) {
        poisons.push(createVector(random(width), random(height)));
    }

    // frameRate(10);
}

function draw() {
    background(55);
    // Randomly generate food
    if (random(1) < foodSlider.value()) {
        foods.push(createVector(random(width), random(height)));
    }
    // Randomly generate poison
    if (random(1) < posionSlider.value()) {
        poisons.push(createVector(random(width), random(height)));
    }

    for (let i = ants.length - 1; i >= 0; i--) {
        ants[i].behaviors(foods, poisons);
        ants[i].update();
        ants[i].boundaries();
        ants[i].show();
        // Try to reproduced
        let newAnt = ants[i].tryToReproduce();
        if (newAnt) {
            ants.push(newAnt);
        }
        // Check if this ant is dead, and if its them remove it from the array and leave a food in its place
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

    // Ants counter
    fill(255);
    text(`${ants.length} ants are alive`, 10, height - 10);
    text(`Press D on the keyboard for degub mode`, 10, height - 30);

    // Calculating how much time passed
    currentTime = new Date();
    timeDiff = currentTime - whenTheWorldCreated;
    timeDiff /= 1000;
    var seconds = Math.round(timeDiff);
    text(`World was created ${seconds} seconds ago`, 10, 20);
}

// function mouseDragged() {
//     ants.push(new Ant(mouseX, mouseY));
// }

function keyPressed() {
    console.log('keyCode', keyCode);
    if (keyCode === 68) {
        controls['debug-mode'] = !controls['debug-mode'];
    }
}

function getTime(d) {}

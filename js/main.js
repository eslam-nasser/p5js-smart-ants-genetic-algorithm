let ants = [];
let foods = [];
let poisons = [];

function setup() {
    createCanvas(640, 480);
    ants.push(new Ant(random(width), random(height)));
    ants.push(new Ant(random(width), random(height)));
    ants.push(new Ant(random(width), random(height)));

    for (let i = 0; i < 50; i++) {
        foods.push(createVector(random(width), random(height)));
    }
    for (let i = 0; i < 10; i++) {
        poisons.push(createVector(random(width), random(height)));
    }
}

function draw() {
    background(55);

    if (random(1) < 0.05) {
        foods.push(createVector(random(width), random(height)));
    }

    for (let i = ants.length - 1; i >= 0; i--) {
        ants[i].behaviors(foods, poisons);
        ants[i].update();
        // ants[i].edges();
        ants[i].show();

        if (ants[i].dead()) {
            ants.splice(i, 1);
        }
    }

    foods.forEach(food => {
        fill(0, 255, 0);
        noStroke();
        ellipse(food.x, food.y, 3);
    });

    poisons.forEach(poison => {
        fill(255, 0, 0);
        noStroke();
        ellipse(poison.x, poison.y, 3);
    });
}

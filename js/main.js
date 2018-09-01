let ants = [];
let foods = [];
let poisons = [];

function setup() {
    createCanvas(640, 480);
    ants.push(new Ant(random(width), random(height)));

    for (let i = 0; i < 100; i++) {
        foods.push(createVector(random(width), random(height)));
        // poisons.push(createVector(random(width), random(height)));
    }
}

function draw() {
    background(55);

    ants.forEach(ant => {
        ant.eat(foods);
        // ant.seek(target);
        ant.update();
        ant.show();
    });

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

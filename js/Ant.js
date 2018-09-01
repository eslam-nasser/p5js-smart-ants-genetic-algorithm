class Ant {
    constructor(x = 0, y = 0) {
        // Forces
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        // Limits
        this.r = 3;
        this.maxSpeed = random(2, 3);
        this.maxForce = random(0.1, 0.3);
        // DNA
        this.dna = [];
        this.dna[0] = random(-5, 5);
        this.dna[1] = random(-5, 5);
        // Health
        this.health = 1;
    }

    applyForce(f) {
        this.acc.add(f);
    }

    update() {
        this.health -= 0.001;

        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    seek(target) {
        const desired = p5.Vector.sub(target, this.pos);
        const d = dist(target.x, target.y, this.pos.x, this.pos.y);
        // if (d < 100) {
        //     const speed = map(d, 0, 100, 0, this.maxSpeed);
        //     desired.setMag(speed);
        // }
        const seekForce = p5.Vector.sub(desired, this.vel);
        seekForce.limit(this.maxForce);
        return seekForce;
    }

    behaviors(good, bad) {
        let steerGood = this.eat(good, 0.1);
        let steerBad = this.eat(bad, -0.5);

        steerGood.mult(this.dna[0]);
        steerBad.mult(this.dna[1]);

        this.applyForce(steerGood);
        this.applyForce(steerBad);
    }

    eat(list, nutrition) {
        let record = Infinity;
        let closestIndex = -1;

        list.forEach((item, i) => {
            // let d = dist(this.pos.x, this.pos.y, item.x, item.y);
            let d = this.pos.dist(item);
            if (d < record) {
                record = d;
                closestIndex = i;
            }
        });

        if (record < 5) {
            list.splice(closestIndex, 1);
            this.health += nutrition;
        } else if (closestIndex > -1) {
            return this.seek(list[closestIndex]);
        }

        return createVector(0, 0);
    }

    dead() {
        return this.health < 0;
    }

    show() {
        const angle = this.vel.heading() + PI / 2;

        push();
        translate(this.pos.x, this.pos.y);
        rotate(angle);

        stroke(0, 255, 0);
        line(0, 0, 0, -this.dna[0] * 20);

        stroke(255, 0, 0);
        line(0, 0, 0, this.dna[1] * 20);

        let gr = color(0, 255, 0);
        let rd = color(255, 0, 0);
        let bodyColor = lerpColor(rd, gr, this.health);

        fill(bodyColor);
        stroke(bodyColor);
        strokeWeight(1);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);

        pop();
    }

    edges() {
        if (this.pos.x < -this.r) this.pos.x = width + this.r;
        if (this.pos.y < -this.r) this.pos.y = height + this.r;
        if (this.pos.x > width + this.r) this.pos.x = -this.r;
        if (this.pos.y > height + this.r) this.pos.y = -this.r;
    }
}

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
        // food weight
        this.dna[0] = random(-2, 2);
        // poison weight
        this.dna[1] = random(-2, 2);
        // food perceprion
        this.dna[2] = random(1, 100);
        // poison perceprion
        this.dna[3] = random(1, 100);

        // Health
        this.health = 1;
    }

    applyForce(f) {
        this.acc.add(f);
    }

    update() {
        this.health -= 0.005;

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
        let steerGood = this.eat(good, 0.1, this.dna[2]);
        let steerBad = this.eat(bad, -0.5, this.dna[3]);

        steerGood.mult(this.dna[0]);
        steerBad.mult(this.dna[1]);

        this.applyForce(steerGood);
        this.applyForce(steerBad);
    }

    eat(list, nutrition, perception) {
        let record = Infinity;
        let closest = null;

        for (let i = list.length - 1; i >= 0; i--) {
            let item = list[i];
            let d = this.pos.dist(item);
            if (d < this.maxSpeed) {
                list.splice(closest, 1);
                this.health += nutrition;
            } else {
                if (d < record && d < perception) {
                    record = d;
                    closest = list[i];
                }
            }
        }

        if (closest !== null) {
            return this.seek(closest);
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

        // Food info
        strokeWeight(3);
        stroke(0, 255, 0);
        noFill();
        line(0, 0, 0, -this.dna[0] * 20);
        ellipse(0, 0, this.dna[2] * 2);

        // Poison info
        strokeWeight(2);
        stroke(255, 0, 0);
        line(0, 0, 0, this.dna[1] * 20);
        ellipse(0, 0, this.dna[3] * 2);

        let gr = color(0, 255, 0);
        let rd = color(255, 0, 0);
        let bodyColor = lerpColor(rd, gr, this.health);

        fill(bodyColor);
        stroke(bodyColor);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);

        pop();
    }

    boundaries() {
        let desired = null;

        if (this.pos.x < 25) {
            desired = createVector(this.maxSpeed, this.vel.y);
        } else if (this.pos.x > width - 25) {
            desired = createVector(-this.maxSpeed, this.vel.y);
        }

        if (this.pos.y < 25) {
            desired = createVector(this.vel.x, this.maxSpeed);
        } else if (this.pos.y > height - 25) {
            desired = createVector(this.vel.x, -this.maxSpeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxSpeed);
            let steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxForce);
            this.applyForce(steer);
        }
    }
}

class Ant {
    constructor(x = 0, y = 0, parentDNA = []) {
        // Forces
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        // Limits
        this.r = 3;
        this.ifInRangeThenEat = 5;
        this.maxSpeed = random(2, 5);
        this.maxForce = random(0.1, 0.5);
        this.mutaionRate = 0.1;
        this.chanceOfReproducing = 0.0001;

        if (parentDNA.legnth > 0) {
            // Copy parent dna
            this.dna[0] = parentDNA[0];
            this.dna[1] = parentDNA[1];
            this.dna[2] = parentDNA[2];
            this.dna[3] = parentDNA[3];
            // Mutaion
            if (random(1) < this.mr) {
                this.dna[0] += random(-0.1, 0.1);
            }
            if (random(1) < this.mr) {
                this.dna[1] += random(-0.1, 0.1);
            }
            if (random(1) < this.mr) {
                this.dna[2] += random(-10, 10);
            }
            if (random(1) < this.mr) {
                this.dna[3] += random(-10, 10);
            }
        } else {
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
        }

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

    tryToReproduce() {
        if (random(1) < this.chanceOfReproducing) {
            return new Ant(this.pos.x, this.pos.y, this.dna);
        } else {
            return null;
        }
    }

    seek(target) {
        const desired = p5.Vector.sub(target, this.pos);
        const d = dist(target.x, target.y, this.pos.x, this.pos.y);
        if (d < 100) {
            const speed = map(d, 0, 100, 0, this.maxSpeed * 1.5);
            desired.setMag(speed);
        }
        const seekForce = p5.Vector.sub(desired, this.vel);
        seekForce.limit(this.maxForce);
        return seekForce;
    }

    behaviors(good, bad) {
        let steerGood = this.eat(good, 0.3, this.dna[2]);
        let steerBad = this.eat(bad, -0.75, this.dna[3]);

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
                list.splice(i, 1);
                // Increase/Decrease health
                this.health += nutrition;
                // Increase/Decrease size
                this.r += nutrition / 4;
                // Increase/Decrease Max Speed
                this.maxSpeed += nutrition / 4;
                // Increase Sight
                if (this.dna[0] < 0.005) {
                    this.dna[0] += 0.0001;
                }
                // Increase the chance of reproducing
                this.chanceOfReproducing += 0.001;
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
        // Debug
        if (controls['debug-mode']) {
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
        } else {
            stroke(255, 50);
            strokeWeight(0.1);
            noFill();
            ellipse(0, 0, this.dna[2] * 2);
        }

        let gr = color(0, 255, 0);
        let rd = color(255, 0, 0);
        let bodyColor = lerpColor(rd, gr, this.health);
        fill(bodyColor);
        stroke(bodyColor);

        // Ant's body
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);

        // Health Text
        let textPos = this.pos.copy();
        fill(255);
        stroke(0);
        rotate(-angle);
        textPos.normalize();
        text(this.health.toFixed(2), textPos.x - 10, textPos.y + 20);
        rotate(angle);

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

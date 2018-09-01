class Ant {
    constructor(x = 0, y = 0) {
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        this.r = 5;
        this.maxSpeed = random(2, 3);
        this.maxForce = random(0.1, 0.3);
    }

    applyForce(f) {
        this.acc.add(f);
    }

    update() {
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
        this.applyForce(seekForce);
    }

    eat(list) {
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
        } else if (closestIndex > -1) {
            this.seek(list[closestIndex]);
        }
    }

    show() {
        const theta = this.vel.heading() + PI / 2;
        fill(255);
        stroke(0);
        strokeWeight(1);
        push();
        translate(this.pos.x, this.pos.y);
        rotate(theta);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();
    }
}

class Block {
    constructor(x, y) {
        this.location = createVector(x, y);
        this.w = 20;
        this.h = 20;
    }

    show() {
        fill(255);
        noStroke();
        ellipse(this.location.x, this.location.y, this.w, this.h);
    }

    update() {
        //
    }
}

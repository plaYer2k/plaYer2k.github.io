/**
 * Basic Icon class
 */
class Icon {
    constructor(x = 0, y = 0, size = 20, img) {
        // create vector for position
        this.pos = createVector(x, y);
        this.size = size;
        this.img = img;

        this.lifeSpan = 0;
        this.hidden = false;
    }

    inIcon(x, y) {
        let point = createVector(x, y);
        return point.dist(this.pos) < this.size / 2;
    }

    onClick() {
        this.lifeSpan = -1000;
    }

    /**
     * Calculates the distance between the icons from corner to corner.
     * Negative values mean they overlap.
     * 
     * @param {Icon} icon
     */
    dist(icon) {
        return this.pos.dist(icon.pos) - (this.size + icon.size) / 2;
    }

    update(td, start) {
        this.lifeSpan += td;
        this.hidden = this.lifeSpan < 0;
    }

    /**
     * Draws the icon with p5.js functions.
     */
    draw() {
        // don't draw if hidden
        if (this.hidden) return;
        circle(this.pos.x, this.pos.y, this.size);
        if (this.img) image(this.img, this.pos.x - this.size / 2, this.pos.y - this.size / 2, this.size, this.size);
    }
}
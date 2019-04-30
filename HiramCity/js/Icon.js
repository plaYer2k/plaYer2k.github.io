/**
 * Basic Icon class
 */
class Icon {
    constructor(x = 0, y = 0, size = 20) {
        // create vector for position
        this.pos = createVector(x, y);
        this.size = size;

        this.lifeSpan = 0;
        this.hide = false;
    }

    /**
     * Calculates the distance between the icons from corner to corner.
     * Negative values mean they overlap.
     * 
     * @param {Icon} icon
     */
    dist(icon) {
        return this.pos.dist(icon.pos);
    }

    /**
     * Draws the icon with p5.js functions.
     */
    draw(td, start) {
        this.lifeSpan += td;
        this.hide = this.lifeSpan > 1000;
        if (!this.hide) circle(this.pos.x, this.pos.y, this.size);
    }
}
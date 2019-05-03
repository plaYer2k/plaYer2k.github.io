/**
 * Camera class for p5.js
 * 
 * It allows moving and scaling of the scene. It just needs to be applied before everything else.
 * There are two functions for converting canvas coordinates to the scene and vise versa.
 * They can come in handy when interacting with the scene.
 */
class Camera {
    constructor() {
        // center point
        this.center = createVector(width / 2, height / 2);

        // offset
        this.offset = createVector(0, 0);
        this.maxOffset = null;
        this.maxOffsetX = null;
        this.maxOffsetY = null;

        // scale
        this.scale = 1.0;
        this.minScale = null;
        this.maxScale = null;
    }

    /**
     * This scales the current scale with the given scale and keeps it within the limits.
     * Scaling a current scale of 2.0 with 2.0 will result into a scale of 4.0 for example.
     * 
     * @param {double} scale 
     */
    zoom(scale) {
        // scale
        this.scale *= scale;

        // limit scale
        if (this.minScale) this.scale = Math.max(this.scale, this.minScale)
        if (this.maxScale) this.scale = Math.min(this.scale, this.maxScale);
    }

    /**
     * Changes the offset of the camera to move to a different section of the scene.
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    move(x = 0, y = 0) {
        // adjust offset
        this.offset.x += x / this.scale;
        this.offset.y += y / this.scale;

        // limit the offset
        if (this.maxOffset) this.offset.limit(this.maxOffset);
        if (this.maxOffsetX) this.offset.x = Math.max(Math.min(this.offset.x, this.maxOffsetX), -this.maxOffsetX);
        if (this.maxOffsetY) this.offset.y = Math.max(Math.min(this.offset.y, this.maxOffsetY), -this.maxOffsetY);
    }

    /**
     * Movement on the x-axis by a given number x.
     * 
     * @param {Number} x 
     */
    moveX(x = 0) {
        this.move(x, 0);
    }

    /**
     * Movement on the y-axis by a given number y.
     * 
     * @param {Number} y 
     */
    moveY(y = 0) {
        this.move(0, y);
    }

    /**
     * Converts a point on the canvas to the corresponding point of the scene.
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    canvasToScene(x, y) {
        return [
            (x - this.center.x) / this.scale - this.offset.x,
            (y - this.center.y) / this.scale - this.offset.y
        ];
    }

    /**
     * Converts a point on the scene to the corresponding point of the canvas.
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    sceneToCanvas(x, y) {
        return [
            (x + this.center.x) * this.scale + this.offset.x,
            (y + this.center.y) * this.scale + this.offset.y
        ];
    }

    /**
     * Applies the camera movement and scale to the canvas.
     */
    apply() {
        // move to center
        if (this.debug) {
            push();
            stroke('red');
            line(0, 0, this.center.x, this.center.y);
            pop();
        }
        translate(this.center.x, this.center.y);

        // scale scene
        scale(this.scale);

        // move to offset
        if (this.debug) {
            push();
            stroke('blue');
            line(0, 0, this.offset.x, this.offset.y);
            pop();
        }
        translate(this.offset.x, this.offset.y);
    }
}
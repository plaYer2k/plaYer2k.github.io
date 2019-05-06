class BrazierIcon extends Icon {
    constructor(x = 0, y = 0) {
        super(x, y, 10, imgBrazier);

        this.logTime = 6 * 60 * 1000;
        this.duration = 20 * 60 * 1000;
        this.isDone = false;
    }

    onClick() {
        this.lifeSpan += this.logTime;
    }

    update(td, start) {
        this.lifeSpan -= td;
        this.lifeSpan = Math.max(0, this.lifeSpan);

        this.isDone = (+moment() - start + this.duration) < this.lifeSpan;
    }

    timeToString(time) {
        time = Math.round(time / 1000);
        return Math.floor(time / 60).toString().padStart(2, '0') + ":" + (time % 60).toString().padStart(2, '0');
    }

    draw() {
        // don't draw if hidden
        if (this.hidden) return;
        image(this.img, this.pos.x - this.size / 2, this.pos.y - this.size / 2, this.size, this.size);
        
        push();
        textSize(this.size / 1.5);
        textAlign(CENTER);
        textFont('monospace');
        fill(255 * (1 - map(this.lifeSpan, 0, this.duration, 0, 1, true)), 0, 0);
        if(this.isDone) fill('green');
        text(this.timeToString(this.lifeSpan), this.pos.x, this.pos.y + this.size);
        pop();
    }
}
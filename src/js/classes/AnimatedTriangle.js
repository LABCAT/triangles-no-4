export default class AnimatedTriangle {
    constructor(p5, x, y, width) {
        this.p = p5;
        this.origin = this.p.createVector(x, y);
        this.x = x;
        this.y = y;
        this.width = 0;
        this.maxWidth = width;
        this.hue = this.p.random(0, 360);
        this.increment = this.p.random(2, 4);
        
        const randY =  this.p.random(0, this.p.height);
        const randX =  this.p.random(0, this.p.width);
        this.direction = this.p.random(['left', 'right', 'up', 'down']);
        this.vDirection = randY >= y ? 'up' : 'down';
        this.hDirection = randX >= x ? 'right' : 'left';
        
        switch (this.direction) {
            case 'left':
                this.destination = this.p.createVector(0 - this.maxWidth, randY);
                break;
            case 'right':
                this.destination = this.p.createVector(this.p.width + this.maxWidth, randY);
                break;
            case 'up':
                this.destination = this.p.createVector(randX, 0 - this.maxWidth);
                break;
            case 'down':
                this.destination = this.p.createVector(randX, this.p.height + this.maxWidth);
                break;
        }
    }

    update() {
        if(this.width < this.maxWidth){
            this.width = this.width + Math.random();
        }
        const increment = this.increment;
        const yUpdate = (this.vDirection === 'up' && this.origin.y < this.destination.y) ? increment
            : (this.vDirection === 'down' && this.origin.y > this.destination.y) ? -increment
            : 0;
        const xUpdate = (this.hDirection === 'right' && this.origin.x < this.destination.x) ? increment
            : (this.hDirection === 'left' && this.origin.x > this.destination.x) ? -increment
            : 0;
        switch (this.direction) {
            case 'left':
                this.origin.add(increment, yUpdate);
                break;
            case 'right':
                this.origin.add(-increment, yUpdate);
                break;
            case 'up':
                this.origin.add(xUpdate, increment);
                break;
            case 'down':
                this.origin.add(xUpdate, -increment);
                break;
        }
    }

    draw() {
        const x1 = 0 - (this.width/2),   
            y1 = 0 + (this.width/2), 
            x2 = 0,
            y2 = 0 - (this.width/2),
            x3 = 0 + (this.width/2), 
            y3 = 0 + (this.width/2);
        this.p.translate(this.origin.x, this.origin.y);
        this.p.strokeWeight(4);
        this.p.stroke(this.hue, 100, 100);
        this.p.fill(this.hue, 100, 100, 0.25);
        this.p.triangle(x1, y1, x2, y2, x3, y3);
        // this.p.stroke(this.hue - 90, 100, 100);
        // this.p.fill(this.hue - 90, 100, 100, 0.5);
        // this.p.triangle(
        //     x1 + (this.width/4), 
        //     y1 -(this.width/4), 
        //     x2, 
        //     y2 + (this.width/4), 
        //     x3 - (this.width/4), 
        //     y3 - (this.width/4)
        // );
        this.p.translate(-this.origin.x, -this.origin.y);
    }
}
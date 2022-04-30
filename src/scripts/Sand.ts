///<reference path="./Particle.ts" />

class Sand extends Particle {
    constructor(x: number, y: number) {
        super(x, y);
        this.color = Color.Tan;
    }
}
///<reference path="./Particle.ts" />

class Oil extends Particle {
    constructor(x: number, y: number) {
        super(x, y);
        this.color = Color.Oil;
        this.liquid = true;
        this.density = 0.9;
    }

    public toString(): string {
        return Color[this.color];
    }
}
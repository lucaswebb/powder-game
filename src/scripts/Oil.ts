///<reference path="./Particle.ts" />

class Oil extends Particle {
    constructor(x: number, y: number) {
        super(x, y);
        this.color = Color.Oil;
    }

    public toString(): string {
        return Color[this.color];
    }
}
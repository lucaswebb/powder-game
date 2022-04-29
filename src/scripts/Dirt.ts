///<reference path="./Particle.ts" />

class Dirt extends Particle {
    constructor(x: number, y: number) {
        super(x, y);
        this.color = Color.Brown;
    }

    public toString(): string {
        return Color[this.color];
    }

}
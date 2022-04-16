///<reference path="./Particle.ts" />

class Stone extends Particle {
    constructor(x: number, y: number) {
        super(x, y);
        this.color = Color.Gray;
    }

    public toString(): string {
        return "Stone";
    }
}
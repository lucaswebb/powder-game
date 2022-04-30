abstract class Particle {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public color: Color;
    public mass: number;
    public density: number = 10; // used to determine if particles pass through each other, stone sinks in water
    public liquid: boolean;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
    }

    applyForce(x: number, y: number): void {
        // recalculate velocity
    }
}
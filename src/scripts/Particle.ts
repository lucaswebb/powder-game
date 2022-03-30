abstract class Particle {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public color: Color;
    public mass: number;

    constructor(x: number, y: number) {
        this.vx = 0;
        this.vy = 0;
    }

    applyForce(x: number, y: number): void {
        // recalculate velocity
    }
}